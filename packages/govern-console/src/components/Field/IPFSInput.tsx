/* eslint-disable */
import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import TextField, { StandardTextFieldProps } from '@material-ui/core/TextField';
import { styled } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { InputField } from 'components/InputFields/InputField';
import { ANButton } from 'components/Button/ANButton';
import { HelpButton } from 'components/HelpButton/HelpButton';
import { useFormContext, Controller } from 'react-hook-form';
import { BlueSwitch } from 'components/Switchs/BlueSwitch';
import { addToIpfs } from 'utils/ipfs';
import { OptionTextStyle, InputSubTitle } from 'components/Titles/styles';

export interface IPFSInputProps {
  /**
   * Label of the field
   */
  label: string;
  /**
   * Placeholder
   */
  placeholder: string;
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
  label,
  placeholder,
  textInputName,
  fileInputName,
  isFile = null,
  shouldUnregister = true,
  ipfsURI,
  ...props
}) => {
  const {
    register,
    control,
    watch,
    getValues,
    formState: { errors },
    trigger,
  } = useFormContext();

  const onChange = (e: any) => {
    trigger(fileInputName);
  };

  const isFileChosen = isFile || `is_file_${fileInputName}`;

  return (
    <React.Fragment>
      <div
        style={{
          width: 'fit-content',
          display: 'flex',
          flexDirection: 'row',
          marginTop: '23px',
          verticalAlign: 'middle',
          lineHeight: '40px',
        }}
      >
        <OptionTextStyle>{'Text'}</OptionTextStyle>
        <div style={{ marginLeft: '20px' }}>
          <Controller
            name={isFileChosen}
            control={control}
            defaultValue={false}
            render={({ field: { onChange, value } }) => (
              <BlueSwitch onChange={onChange} value={value} />
            )}
          />
        </div>
        <OptionTextStyle>{'File'}</OptionTextStyle>
      </div>
      {ipfsURI && (
        <InputSubTitle>
          Current Rules:
          <a href={ipfsURI} target="_blank" rel="noreferrer noopener">
            Read more
          </a>
        </InputSubTitle>
      )}
      <InputSubTitle>{label}</InputSubTitle>
      {!watch(isFileChosen) ? (
        <Controller
          name={textInputName}
          control={control}
          defaultValue={''}
          shouldUnregister={shouldUnregister}
          rules={{ required: 'This is required.' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              label=""
              onInputChange={onChange}
              value={value}
              height={'100px'}
              placeholder={placeholder}
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
      ) : (
        <div>
          <div
            style={{
              width: 'inherited',
              display: 'flex',
              flexDirection: 'row',
              verticalAlign: 'middle',
              lineHeight: '40px',
              marginTop: '17px',
            }}
          >
            {
              <input
                {...register(fileInputName, {
                  shouldUnregister: shouldUnregister,
                  required: 'This is required.',
                  validate: (value) => {
                    return true;
                  },
                })}
                type="file"
                onChange={onChange}
              />
            }
          </div>

          <p>{errors[fileInputName] && errors[fileInputName].message}</p>
        </div>
      )}
    </React.Fragment>
  );
};
