/* eslint-disable */
import React, { useState, useEffect } from 'react';
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
import {
  useLayout,
  Grid,
  GridItem,
  Accordion,
  TextInput,
  TextCopy,
  Box,
  Button,
  StyledText,
  SPACING,
  ContentSwitcher,
} from '@aragon/ui';

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
  title,
  subtitle,
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

  const { layoutName } = useLayout();
  const spacing = SPACING[layoutName];

  const onChange = (e: any) => {
    trigger(fileInputName);
  };

  useEffect(() => {}, []);

  const isFileChosen = isFile || `is_file_${fileInputName}`;

  return (
    <React.Fragment>
      <StyledText name={'title2'}>{title}</StyledText>
      <StyledText name={'body3'}>{subtitle}</StyledText>
      <div
        style={{
          width: 'fit-content',
          display: 'flex',
          flexDirection: 'row',
          marginTop: SPACING[layoutName],
          verticalAlign: 'middle',
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
                horizontal: SPACING[layoutName] * 2,
                vertical: SPACING[layoutName] / 4,
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
          <StyledText name={'title4'} style={{ marginTop: spacing }}>
            File
          </StyledText>
          <StyledText name={'body3'}>Upload file</StyledText>

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

          <p>{errors[fileInputName] && errors[fileInputName].message}</p>
        </div>
      )}
      {ipfsURI && (
        <StyledText name={'body2'}>
          Current file:
          <a href={ipfsURI} target="_blank" rel="noreferrer noopener">
            View Document
          </a>
        </StyledText>
      )}
    </React.Fragment>
  );
};
