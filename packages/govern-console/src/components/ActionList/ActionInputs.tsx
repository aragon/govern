import React from 'react';
import { TextInput } from '@aragon/ui';
import { memo } from 'react';
import { actionType } from 'utils/types';

type ActionInputsProps = {
  action: actionType & { id: string };
  index: number;
  register: (name: string) => void;
};

const getFieldName = (actionIndex: number, inputIndex: number) =>
  `actions[${actionIndex}].params[${inputIndex}].value`;

export const ActionInputs: React.FC<ActionInputsProps> = memo(function ActionInputs({
  index,
  action,
  register,
}) {
  return (
    <>
      {action.item.inputs.map((input: any, num: number) => {
        const element = (
          <TextInput
            key={`input-${action.id}-${num}`}
            {...register(getFieldName(index, num))}
            subtitle={input.type}
            wide
            placeholder={input.name}
          />
        );
        return element;
      })}
    </>
  );
});
