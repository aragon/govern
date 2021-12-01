import React, { useEffect, useState } from 'react';
import { TextInput } from '@aragon/ui';
import { Control, FieldValues, useController } from 'react-hook-form';

type ActionInputTextProps = {
  input: any;
  inputNum: number;
  actionIndex: number;
  formControl: Control<FieldValues>;
};

const ActionInputText: React.FC<ActionInputTextProps> = ({
  input,
  inputNum,
  actionIndex,
  formControl,
}) => {
  const [value, setValue] = useState<string | null>();
  const { field: controllerField, fieldState: controllerFieldState } = useController({
    name: `actions.${actionIndex}.inputs.${inputNum}.value`,
    control: formControl,
    rules: {
      required: 'This is required.',
    },
  });

  useEffect(() => {
    if (value) {
      controllerField.onChange(value);
    }
  }, [value, controllerField]);

  return (
    <TextInput
      wide
      value={value}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
      subtitle={input.name}
      placeholder={input.type}
      status={controllerFieldState.error ? 'error' : 'normal'}
      error={controllerFieldState.error ? controllerFieldState.error.message : null}
    />
  );
};

export default ActionInputText;
