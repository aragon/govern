import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  useLayout,
  TextInput,
  StyledText,
  SPACING,
  ContentSwitcher,
  Grid,
  GridItem,
  RADII,
  useTheme,
} from '@aragon/ui';
import { toUtf8String } from 'ethers/lib/utils';

export interface IPFSInputProps {
  /**
   * to be removed
   */
  label?: string;
  /**
   * Title of the field
   */
  title?: string;
  /**
   * Sub Title of the field
   */
  subtitle?: string;
  /**
   * Placeholder
   */
  placeholder?: string;
  /**
   * name of the text type input field in the controller.
   */
  textInputName: string;
  /**
   * name of the file type input field.
   */
  fileInputName: string;
  /**
   * Optional param to detect if the file is chosen(true) or text field(false)
   * Works well with shouldUnregister prop.
   *
   * If shouldUnregister is false, isFile prop is needed so
   * parent can track which type was chosen.
   *
   * If shouldUnregister is true(default), isFile prop is not needed
   * and parent can directly check first the file on getValues.
   * In case it's undefined, it means it was text that user chose.
   */
  isFile?: string;
  /**
   * Whether or not unregister field after changing checkbox value.
   * If user put something in text field and then switched to file type,
   * and then came back to text field, value will not be preserved
   */
  shouldUnregister?: boolean;
  /**
   * IPFS gateway url of the file.
   */
  ipfsURI?: string;
}

export const IPFSInput: React.FC<IPFSInputProps> = ({
  title,
  subtitle,
  textInputName,
  fileInputName,
  isFile = null,
  shouldUnregister = true,
  ipfsURI,
  placeholder,
}) => {
  const {
    register,
    control,
    watch,
    formState: { errors },
    trigger,
  } = useFormContext();
  const theme = useTheme();
  const { layoutName } = useLayout();
  const spacing = SPACING[layoutName];

  const onChange = () => {
    trigger(fileInputName);
  };

  const isFileChosen = isFile || `is_file_${fileInputName}`;

  return (
    <div>
      {title && <StyledText name={'title2'}>{title}</StyledText>}
      {subtitle && <StyledText name={'body2'}>{subtitle}</StyledText>}
      <div
        style={{
          width: 'fit-content',
          display: 'flex',
          flexDirection: 'row',
          verticalAlign: 'middle',
          margin: `${SPACING['small']}px 0 ${SPACING['medium']}px 0`,
          lineHeight: '40px',
        }}
      >
        <Controller
          name={isFileChosen}
          control={control}
          defaultValue={false}
          render={({ field: { onChange, value } }) => (
            <ContentSwitcher
              onChange={onChange}
              selected={value}
              items={['Text', 'File']}
              paddingSettings={{
                horizontal: spacing * 2,
                vertical: spacing / 4,
              }}
            />
          )}
        />
      </div>
      {!watch(isFileChosen) ? (
        <Controller
          name={textInputName}
          control={control}
          defaultValue={''}
          shouldUnregister={shouldUnregister}
          rules={{ required: 'This is required.' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextInput.Multiline
              wide
              placeholder={placeholder}
              value={typeof value !== 'string' ? toUtf8String(value) : value}
              onChange={onChange}
              status={!!error ? 'error' : 'normal'}
              error={error ? error.message : null}
            />
          )}
        />
      ) : (
        <div>
          <StyledText name={'body3'}>Upload file</StyledText>

          {
            <input
              {...register(fileInputName, {
                shouldUnregister: shouldUnregister,
                required: 'This is required.',
                validate: () => {
                  return true;
                },
              })}
              type="file"
              onChange={onChange}
            />
          }

          <p style={{ color: theme.red }}>
            {errors[fileInputName] && errors[fileInputName].message}
          </p>
        </div>
      )}
      {ipfsURI && (
        <div
          style={{
            background: 'rgb(102, 218, 255, 0.07)',
            borderRadius: RADII[layoutName],
          }}
        >
          <Grid>
            <GridItem
              gridColumn={'1/2'}
              alignHorizontal={layoutName !== 'small' ? 'flex-start' : 'center'}
            >
              <StyledText name={'body2'} style={{ padding: spacing }}>
                Current file:
              </StyledText>
            </GridItem>
            <GridItem
              gridColumn={'2/3'}
              alignHorizontal={layoutName !== 'small' ? 'flex-end' : 'center'}
            >
              <StyledText name={'body2'} style={{ padding: spacing }}>
                <a href={ipfsURI} target="_blank" rel="noreferrer noopener">
                  View Document
                </a>
              </StyledText>
            </GridItem>
          </Grid>
        </div>
      )}
    </div>
  );
};
