import React, { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  useLayout,
  TextInput,
  StyledText,
  SPACING,
  ContentSwitcher,
  useTheme,
  FileInput,
} from '@aragon/ui';
import { toUtf8String } from 'ethers/lib/utils';
import { useEffect } from 'react';
import { ipfsMetadata } from 'utils/types';

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
  ipfsMetadata?: ipfsMetadata;
}

export const IPFSInput: React.FC<IPFSInputProps> = ({
  title,
  subtitle,
  textInputName,
  fileInputName,
  isFile,
  shouldUnregister = true,
  ipfsMetadata,
  placeholder,
}) => {
  const {
    control,
    watch,
    getValues,
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { layoutName } = useLayout();
  const spacing = SPACING[layoutName];
  const theme = useTheme();
  const isFileChosen = isFile || `is_file_${fileInputName}`;

  const formatValue = (value: any) => {
    if (value && typeof value !== 'string') {
      return Object.keys(value).map((key) => ({
        // status: 'loading',
        name: value[Number(key)].name,
        url: null,
      }));
    } else if (ipfsMetadata?.endpoint) {
      return [
        {
          // status: ipfsURI && 'success',
          name: ipfsMetadata.endpoint && 'Current file:',
          url: ipfsMetadata.endpoint && ipfsMetadata.endpoint,
        },
      ];
    }
  };

  const [files, setFiles] = useState();
  useEffect(() => {
    if (files) {
      setValue(fileInputName, files);
    }
  }, [files, setValue, fileInputName]);

  useEffect(() => {
    if (ipfsMetadata?.text) {
      setValue(textInputName, ipfsMetadata.text);
    } else if (ipfsMetadata?.endpoint) {
      setValue(isFileChosen, true);
    }
  }, [setValue, ipfsMetadata, isFileChosen, textInputName]);

  return (
    <div>
      {title && <StyledText name={'title2'}>{title}</StyledText>}
      {subtitle && (
        <StyledText name={'body2'} style={{ color: theme.disabledContent }}>
          {subtitle}
        </StyledText>
      )}
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
              value={
                typeof value !== 'string' && !(value instanceof FileList)
                  ? toUtf8String(value)
                  : value
              }
              onChange={onChange}
              status={!!error ? 'error' : 'normal'}
              error={error ? error.message : null}
            />
          )}
        />
      ) : (
        // bug: investigate more to see why it is not working with controlled component
        // and why it shares the same value with previous component

        // <Controller
        //   name={fileInputName}
        //   control={control}
        //   defaultValue={''}
        //   shouldUnregister={shouldUnregister}
        //   rules={{ required: 'This is required.' }}
        //   render={({ field: { onChange, value }, fieldState: { error } }) => {
        //     console.log(
        //       'FileInput value',
        //       value,
        //       'getValues(fileInputName)',
        //       getValues(fileInputName),
        //     );
        //     return (
        //       <FileInput
        //         onChange={onChange}
        //         value={formatValue(value)}
        //         status={!!error ? 'error' : 'normal'}
        //         error={error ? error.message : null}
        //       />
        //     );
        //   }}
        // />

        // a work arround is using register and handle onChange and value manually:
        <FileInput
          {...register(fileInputName, {
            shouldUnregister: shouldUnregister,
            required: 'This is required.',
          })}
          onChange={setFiles}
          value={formatValue(getValues(fileInputName))}
          status={!!errors[fileInputName] ? 'error' : 'normal'}
          error={errors[fileInputName] ? errors[fileInputName].message : null}
        />
      )}
    </div>
  );
};
