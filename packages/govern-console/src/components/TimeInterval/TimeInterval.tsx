import React, { ReactNode } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { useTheme, SPACING, useLayout, StyledText, TextInput, DropDown } from '@aragon/ui';
import { TIME_INTERVALS } from 'utils/constants';
import { useEffect } from 'react';
import getInterval from 'utils/TimeInterval';

interface TimeIntervalInputs {
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
  inputName: string;
  dropdownName: string;
  resultName: string;
  shouldUnregister?: boolean;
  timeInSeconds?: number;
  placeholder?: string;
}

export const TimeInterval: React.FC<TimeIntervalInputs> = ({
  title,
  subtitle,
  inputName,
  dropdownName,
  resultName,
  shouldUnregister = false,
  timeInSeconds,
  placeholder,
}) => {
  const theme = useTheme();
  const { layoutName } = useLayout();
  const spacing = SPACING[layoutName];
  const { control, setValue, getValues } = useFormContext();

  const updateResult = (amount: number, interval: number) => {
    setValue(resultName, amount * interval);
  };

  // if timeInSeconds provided
  useEffect(() => {
    if (timeInSeconds) {
      const intervalObj = getInterval(timeInSeconds);
      if (intervalObj) {
        setValue(inputName, intervalObj.value);
        setValue(dropdownName, intervalObj.index);
      }
    }
  }, [timeInSeconds, dropdownName, inputName, setValue]);

  return (
    <div>
      {typeof title === 'string' ? <StyledText name={'title3'}>{title}</StyledText> : title}
      {typeof subtitle === 'string' ? (
        <StyledText name={'title4'} style={{ color: theme.disabledContent }}>
          {subtitle}
        </StyledText>
      ) : (
        subtitle
      )}
      <div
        css={`
          width: 100%;
          display: inline-flex;
          flex-wrap: wrap;
          gap: ${spacing}px;
        `}
      >
        <Controller
          key={`key-${inputName}`}
          name={inputName}
          control={control}
          defaultValue={getValues(inputName)}
          shouldUnregister={shouldUnregister}
          rules={{
            required: 'This is required.',
            pattern: {
              value: /^[1-9]\d*$/i,
              message: 'Please insert a positive round number.',
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextInput
              value={value}
              placeholder={placeholder}
              onChange={(event: any) => {
                updateResult(event.target.value, TIME_INTERVALS.values[getValues(dropdownName)]);
                onChange(event);
              }}
              width={layoutName === 'large' ? '270px' : ''}
              wide={layoutName === 'large' ? false : true}
              status={!!error ? 'error' : 'normal'}
              error={error ? error.message : null}
            />
          )}
        />
        <Controller
          key={`key-${dropdownName}`}
          name={dropdownName}
          control={control}
          defaultValue={getValues(dropdownName)}
          shouldUnregister={shouldUnregister}
          rules={{
            required: 'This is required.',
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <DropDown
              items={TIME_INTERVALS.names}
              placeholder="Select time"
              selected={value}
              onChange={(index: number) => {
                updateResult(getValues(inputName), TIME_INTERVALS.values[index]);
                onChange(index);
              }}
              wide={layoutName !== 'large'}
              status={!!error ? 'error' : 'normal'}
              error={error ? error.message : null}
            />
          )}
        />
      </div>
    </div>
  );
};
