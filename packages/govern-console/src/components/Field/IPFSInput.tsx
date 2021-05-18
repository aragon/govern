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
import { OptionTextStyle, InputSubTitle } from 'components/Titles/styles'

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
   * helper string which registers another control in the form
   */
  isFile: string;
  /**
   * IPFS gateway url of the file.
   */
  ipfsURI?: string;
  /**
   * If the file type is chosen, we set the ipfs cid
   * via setIpfsCid.
   */
  updateFile: (val: any) => any;
}

export const IPFSInput: React.FC<IPFSInputProps> = ({
  label,
  placeholder,
  textInputName,
  fileInputName,
  isFile,
  ipfsURI,
  updateFile,
  ...props
}) => {
  const {
    register,
    control,
    watch,
    getValues,
    formState: { errors },
    trigger
  } = useFormContext();
    
  const [cidUploaded, setCidUploaded] = useState<boolean>(false);

  const upload = async () => {
    // const file = getValues(fileInputName);
    // if (!file || file.length === 0) {
    //     return;
    // }
    // const cid = await addToIpfs(file[0]);
    // updateCid(cid);
    // setCidUploaded(true);
    // trigger(fileInputName)
  }

  const onChange = (e:any) => {
    const files = e.target.files
    updateFile(files);
  }


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
            name={isFile}
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
      {!watch(isFile) ? (
        <Controller
          name={textInputName}
          control={control}
          defaultValue={''}
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
                  required: 'This is required.',
                //   validate: (value) => {
                //     if(!cidUploaded) {
                //         return 'File is not uploaded'
                //     }
                //     return true
                //   },
                })}
                type="file"
                onChange={onChange}
              />
            }
          </div>
          
          <p>{errors[fileInputName] && errors[fileInputName].message }</p>
          {/* <ANButton
            label={'Upload to IPFS'}
            buttonType={'primary'}
            onClick={upload}
            style={{ marginTop: '34px' }}
            disabled={!watch(fileInputName) || watch(fileInputName).length == 0}
          /> */}
        </div>
      )}
    </React.Fragment>
  );
};
