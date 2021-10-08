import { Modal } from '@aragon/ui';
import styled from 'styled-components';
import NewTransfer from './components/ModalContents/NewTransfer';
import ReviewDeposit from './components/ModalContents/ReviewDeposit';
import { useForm, FormProvider, Controller, useFormContext } from 'react-hook-form';
import { useTransferContext, TransferProvider } from './components/ModalContents/TransferContext';
import SelectToken from './components/ModalContents/components/SelectToken/SelectToken';
import SignDeposit from './components/ModalContents/SignDeposit';

type Props = { opened: boolean; close: () => void; daoName: string; executorId: string };
type DepositFormData = {
  token: any;
  isCustomToken: boolean;
  depositAmount: string;
  reference?: string;
};

const TransferModal = styled(Modal)`
  & > div > div > div {
    border-radius: 16px !important;
    background: #f6f9fc;
    max-height: 768px;
    overflow: auto;
    max-width: 487px;
  }
`;

const DaoTransferModal: React.FC<Props> = ({ opened, close, daoName, executorId }) => {
  const methods = useForm<DepositFormData>();

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
  const { state, gotoState } = useTransferContext();
  const { reset, control, setValue } = useFormContext();

  const handleModalClose = () => {
    close();
    reset();
    gotoState('initial');
  };

  const handleBackClick = () => {
    gotoState('initial');
  };

  const handleTokenSelected = (onChange: (value: any) => void, value: any) => {
    onChange(value);
    handleBackClick();
    setValue('isCustomToken', false);
  };

  return (
    <TransferModal visible={opened} onClose={handleModalClose}>
      {
        {
          fail: <div>Fails</div>,
          sign: <SignDeposit />,
          review: <ReviewDeposit />,
          initial: <NewTransfer />,
          success: <div>Success</div>,
          selectToken: (
            <Controller
              name="token"
              control={control}
              defaultValue={null}
              render={({ field: { onChange } }) => (
                <SelectToken
                  onTokenSelected={(value: any) => handleTokenSelected(onChange, value)}
                />
              )}
            />
          ),
        }[state]
      }
    </TransferModal>
  );
};

export default DaoTransferModal;
