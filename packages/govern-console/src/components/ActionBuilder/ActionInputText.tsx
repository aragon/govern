import React from 'react';
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
  const { field: controllerField, fieldState: controllerFieldState } = useController({
    name: `actions.${actionIndex}.inputs.${inputNum}.value`,
    control: formControl,
    defaultValue: '',
    rules: {
      required: 'This is required.',
    },
  });

  return (
    <TextInput
      wide
      value={controllerField.value}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        controllerField.onChange(event.target.value)
      }
      subtitle={input.name}
      placeholder={input.type}
      status={controllerFieldState.error ? 'error' : 'normal'}
      error={controllerFieldState.error ? controllerFieldState.error.message : null}
    />
  );
};

export default ActionInputText;
