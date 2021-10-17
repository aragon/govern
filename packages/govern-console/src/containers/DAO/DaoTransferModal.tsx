import styled from 'styled-components';
import { useMemo } from 'react';
import { Modal, useLayout } from '@aragon/ui';
import { useForm, FormProvider, Controller, useFormContext } from 'react-hook-form';

import Sign from './components/ModalContents/SignTransfer';
import Review from './components/ModalContents/ReviewTransfer';
import NewTransfer from './components/ModalContents/NewTransfer';
import SelectToken from './components/ModalContents/components/SelectToken/SelectToken';
import { useTransferContext, TransferProvider } from './components/ModalContents/TransferContext';

type Props = { opened: boolean; close: () => void; daoName: string; executorId: string };

type DepositFormData = {
  type: number;
  token: any;
  title: string;
  proof: string;
  amount: string;
  recipient: string;
  proofFile: string;
  reference?: string;
  isCustomToken: boolean;
};

const defaultFormProps = {
  type: 0,
  token: undefined,
  title: '',
  proof: '',
  amount: '',
  recipient: '',
  proofFile: '',
  reference: '',
  isCustomToken: false,
};

const TransferModal = styled(Modal)`
  & > div > div > div {
    border-radius: 16px !important;
    background: #f6f9fc;
    max-height: 768px;
    overflow: auto;
    max-width: 486px;
  }
`;

const DaoTransferModal: React.FC<Props> = ({ opened, close, daoName, executorId }) => {
  const methods = useForm<DepositFormData>({
    mode: 'onChange',
    defaultValues: defaultFormProps,
  });

  return (
    <TransferProvider daoName={daoName} executor={executorId}>
      <FormProvider {...methods}>
        <TransferSwitcher opened={opened} close={close} />
      </FormProvider>
    </TransferProvider>
  );
};

type SwitcherProps = {
  opened: boolean;
  close: () => void;
};

const TransferSwitcher: React.FC<SwitcherProps> = ({ opened, close }) => {
  const { layoutName } = useLayout();
  const layoutIsSmall = useMemo(() => layoutName === 'small', [layoutName]);
  const { state, gotoState } = useTransferContext();
  const { reset, control, setValue } = useFormContext();

  const handleModalClose = () => {
    reset(defaultFormProps);
    gotoState('initial');
    close();
  };

  const handleTokenSelected = (onChange: (value: any) => void, value: any) => {
    setValue('isCustomToken', false);
    onChange(value);
    gotoState('initial');
  };

  const renderState = () => {
    switch (state) {
      case 'initial':
        return <NewTransfer />;
      case 'review':
        return <Review />;
      case 'sign':
        return <Sign onClose={handleModalClose} />;
      //TODO: change token selected
      case 'selectToken':
        return (
          <Controller
            name="token"
            control={control}
            defaultValue={null}
            render={({ field: { onChange } }) => (
              <SelectToken onTokenSelected={(value: any) => handleTokenSelected(onChange, value)} />
            )}
          />
        );
    }
  };

  return (
    <TransferModal
      visible={opened}
      onClose={handleModalClose}
      css={layoutIsSmall ? 'width:100%!important;' : ''}
    >
      {renderState()}
    </TransferModal>
  );
};

export default DaoTransferModal;
