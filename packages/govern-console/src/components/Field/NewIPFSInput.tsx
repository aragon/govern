import React, { ReactNode } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { useLayout, TextInput, SPACING, FileInput } from '@aragon/ui';
import { toUtf8String } from 'ethers/lib/utils';
import { useEffect } from 'react';
import { ipfsMetadata } from 'utils/types';
import { validateFileSize } from 'utils/validations';
import { ContentSwitcher } from 'components/ContentSwitcher/ContentSwitcher';

export interface NewIPFSInputProps {
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
  subtitle?: ReactNode | string;
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
  /**
   * Optional number of rows/lines for textarea if free text is chosen for component
   */
  rows?: number;
}

export const NewIPFSInput: React.FC<NewIPFSInputProps> = ({
  textInputName,
  fileInputName,
  isFile,
  shouldUnregister = true,
  ipfsMetadata,
  placeholder,
  rows,
}) => {
  const { control, watch, setValue } = useFormContext();
  const { layoutName } = useLayout();
  const spacing = SPACING[layoutName];
  const isFileChosen = isFile || `is_file_${fileInputName}`;

  const formatValue = (value: any) => {
    if (value && typeof value !== 'string') {
      return Object.keys(value).map((key) => ({
        // status: 'loading',
        name: value[Number(key)].name,
        url: null,
      }));
    } else if (ipfsMetadata?.endpoint && !ipfsMetadata?.text) {
      return [
        {
          // status: ipfsURI && 'success',
          name: ipfsMetadata.endpoint && 'Current file:',
          url: ipfsMetadata.endpoint && ipfsMetadata.endpoint,
        },
      ];
    }
  };

  useEffect(() => {
    if (ipfsMetadata?.text) {
      setValue(textInputName, ipfsMetadata.text);
    } else if (ipfsMetadata?.endpoint) {
      setValue(isFileChosen, true);
      setValue(fileInputName, ipfsMetadata.endpoint);
    }
  }, [setValue, ipfsMetadata, isFileChosen, textInputName, fileInputName]);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          verticalAlign: 'middle',
          margin: `${SPACING['small']}px 0 ${SPACING['medium']}px 0`,
        }}
      >
        <Controller
          name={isFileChosen}
          control={control}
          defaultValue={0}
          render={({ field: { onChange, value } }) => (
            <ContentSwitcher items={['Text', 'File']} selected={value} onChange={onChange} />
          )}
        />
      </div>
      {!watch(isFileChosen) ? (
        <Controller
          key={`key-${textInputName}`}
          name={textInputName}
          control={control}
          defaultValue={''}
          shouldUnregister={shouldUnregister}
          rules={{ required: 'This is required.' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextInput.Multiline
              wide
              placeholder={placeholder}
              rows={rows ? rows : 2}
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
        <Controller
          key={`key-${fileInputName}`}
          name={fileInputName}
          control={control}
          defaultValue={''}
          shouldUnregister={shouldUnregister}
          rules={{
            required: 'This is required.',
            validate: (value) => validateFileSize(value, 20),
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FileInput
              onChange={onChange}
              value={formatValue(value)}
              status={!!error ? 'error' : 'normal'}
              error={error ? error.message : null}
            />
          )}
        />
      )}
    </div>
  );
};
