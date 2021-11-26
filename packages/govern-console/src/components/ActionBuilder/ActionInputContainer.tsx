import React, { useEffect, useState } from 'react';
import { Control, FieldValues, useController } from 'react-hook-form';
import { DropDown, LoadingRing, useTheme } from '@aragon/ui';
import { useProposalListQuery, useLazyProposalQuery } from 'hooks/query-hooks';
import { getTitleTransaction } from 'utils/HelperFunctions';
import { getProposalParams } from 'utils/ERC3000';

type ActionInputContainerProps = {
  input: any;
  inputNum: number;
  actionIndex: number;
  formControl: Control<FieldValues>;
  queueId: string;
};

type ActionsType = {
  __typename?: string;
  id: string;
  state: string;
  createdAt: string;
  payload: {
    __typename?: string;
    id: string;
    executionTime: string;
    title: string;
  };
};

const ActionInputContainer: React.FC<ActionInputContainerProps> = ({
  input,
  inputNum,
  actionIndex,
  formControl,
  queueId,
}) => {
  const theme = useTheme();
  const { loading, data, error } = useProposalListQuery(queueId);
  const { getProposalData, data: proposalData, loading: proposalLoading } = useLazyProposalQuery(
    false,
  );
  const [dropdownValue, setDropdownValue] = useState<number>();
  const { field: controllerField, fieldState: controllerFieldState } = useController({
    name: `actions.${actionIndex}.inputs.${inputNum}.value`,
    control: formControl,
    rules: {
      required: 'This is required.',
    },
  });

  useEffect(() => {
    if (dropdownValue !== undefined) {
      const selectedContainer = data.governQueue.containers[dropdownValue];
      if (selectedContainer) {
        getProposalData({ variables: { id: selectedContainer.id } });
      }
    }
  }, [dropdownValue, getProposalData, data]);

  useEffect(() => {
    if (!proposalLoading && proposalData?.container) {
      controllerField.onChange(JSON.stringify(getProposalParams(proposalData.container)));
    }
  }, [proposalData, proposalLoading, controllerField, input]);

  if (loading) {
    return <LoadingRing />;
  }

  if (error) {
    return <div style={{ color: `${theme.red}` }}>{error.message}</div>;
  }

  const titles = data.governQueue.containers.map((container: ActionsType) =>
    getTitleTransaction(container.payload.title),
  );
  return (
    <div key={`actions.${actionIndex}.inputs.${inputNum}.value`}>
      <span style={{ color: `${theme.disabledContent}` }}>{input.name}</span>
      {proposalLoading && <LoadingRing />}
      <DropDown
        wide
        disabled={proposalLoading}
        items={titles}
        selected={dropdownValue}
        onChange={setDropdownValue}
      />
      {controllerFieldState.error ? (
        <div style={{ color: `${theme.red}` }}>{controllerFieldState.error.message}</div>
      ) : null}
    </div>
  );
};

export default ActionInputContainer;
