import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import { useCallback, useMemo, useRef } from 'react';
import { IconLeft, IconDownload, GU, Button, IconRight, useToast, IconExternal } from '@aragon/ui';

import { useTransferContext } from './TransferContext';
import { Asset } from 'utils/Asset';
import { Executor } from 'services/Executor';
import { getErrorFromException } from 'utils/HelperFunctions';
import { getTruncatedAccountAddress } from 'utils/account';
import AbiHandler from 'utils/AbiHandler';
import { addToIpfs } from 'utils/ipfs';
import { useDaoQuery } from 'hooks/query-hooks';
import { buildConfig } from 'utils/ERC3000';
import { useFacadeProposal } from 'hooks/proposal-hooks';
import { CustomTransaction } from 'utils/types';
import { useWallet } from 'providers/AugmentedWallet';

const ReviewDeposit: React.FC = () => {
  const toast = useToast();
  const context: any = useWallet();
  const { networkName } = useWallet();
  const { getValues, watch } = useFormContext();
  const { account, provider } = context;
  const { daoIdentifier, executorId, gotoState, setTransactions } = useTransferContext();
  const withdrawSignature =
    'function withdraw(address token, address from, address to, uint256 amount, string memory reference)';

  // TODO: Memo useless?
  const {
    title,
    token,
    depositAmount,
    type,
    reference,
    proof,
    proofFile,
    recipient,
  } = useMemo(() => getValues(), [getValues]);

  const SendToTokenContract = useCallback(() => {
    window.open(
      `${
        {
          Rinkeby: 'https://rinkeby.etherscan.io/token/',
          Mainnet: 'https://etherscan.io/token/',
        }[networkName] + token.address
      }`,
      '_blank',
    );
  }, [token, networkName]);

  const transactionsQueue = useRef<CustomTransaction[]>([]);

  const { data: daoDetails } = useDaoQuery(daoIdentifier);

  const proposalInstance = useFacadeProposal(
    daoDetails?.queue.address,
    daoDetails?.queue.config.resolver,
  );

  const executeTransfer = useCallback(async () => {
    const {
      token: { symbol, address },
      depositAmount,
      reference = '',
    } = getValues();

    try {
      const asset = await Asset.createFromDropdownLabel(symbol, address, depositAmount, provider);

      console.log(asset);

      if (type === 1) {
        // type === deposit
        const executor = new Executor(executorId, account.signer);
        const transaction = await executor.deposit(asset, reference);
        setTransactions(transaction);
      } else {
        const values = [asset.address, executorId, recipient, asset.amount, reference];
        const action = AbiHandler.mapToAction(withdrawSignature, executorId, values);
        try {
          const encodedActions = AbiHandler.encodeActions([action]);
          const proof = getValues('proofFile') ? getValues('proofFile')[0] : getValues('proof');
          const proofCid = await addToIpfs(proof, {
            title: getValues('title'),
          });

          // let containerHash: string | undefined;

          const payload = {
            submitter: account.address,
            executor: daoDetails.executor.address,
            actions: encodedActions,
            proof: proofCid,
          };

          if (proposalInstance) {
            try {
              transactionsQueue.current = await proposalInstance.schedule(
                payload,
                buildConfig(daoDetails.queue.config),
              );
            } catch (error) {
              console.log('Failed scheduling', error);
              toast(error.message);
              return;
            }
          }

          setTransactions(transactionsQueue.current);
        } catch (err) {
          console.log('Failed to encode action data', err);
          toast('Error encoding action data, please double check your action input.');
        }
        // setActions(action);
      }
      gotoState('sign');
    } catch (err) {
      console.log('deposit error', err);
      const errorMessage = getErrorFromException(err);
      toast(errorMessage);
    }
  }, [
    getValues,
    executorId,
    provider,
    setTransactions,
    gotoState,
    toast,
    recipient,
    proposalInstance,
    daoDetails,
    account,
    // setActions,
    type,
  ]);

  return (
    <>
      <HeaderContainer>
        <BackButton onClick={() => gotoState('initial')}>
          <IconLeft />
        </BackButton>
        <Title>Review transfer</Title>
      </HeaderContainer>
      <BodyContainer>
        <TransactionWrapper>
          <IconContainer>
            <Icon>
              <IconDownload />
            </Icon>
          </IconContainer>
          <TransferContainer>
            <TransferTitle>{title}</TransferTitle>
            <TransferSubtitle>Review now</TransferSubtitle>
          </TransferContainer>
        </TransactionWrapper>
        <AddressContainer>
          <AddressBox>
            <AddressTitle>From</AddressTitle>
            <AddressContent>{getTruncatedAccountAddress(account.address)}</AddressContent>
          </AddressBox>
          <CustomIconRight size="medium" />
          <AddressBox>
            <AddressTitle>To</AddressTitle>
            <AddressContent>{daoIdentifier}</AddressContent>
          </AddressBox>
        </AddressContainer>
        <InfoBox>
          <InfoRow>
            <InfoKey>Token</InfoKey>
            <InfoValue>{token.symbol}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoKey>Token Address</InfoKey>
            <InfoValue>
              {getTruncatedAccountAddress(token.address)}
              <TokenLink onClick={SendToTokenContract} />
            </InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoKey>Amount</InfoKey>
            <InfoValue>
              + {depositAmount} {token.symbol}
            </InfoValue>
          </InfoRow>
          <InfoColumn>
            <InfoKey>Reference</InfoKey>
            <InfoValue>{reference}</InfoValue>
          </InfoColumn>
          {!watch('type') && (
            <>
              <InfoColumn>
                <InfoKey>Justification</InfoKey>
                <InfoValue>{proofFile ? proofFile[0].name : proof}</InfoValue>
              </InfoColumn>
            </>
          )}
        </InfoBox>
      </BodyContainer>
      <SubmitButton onClick={executeTransfer}>
        <p>Sign {title}</p>
        <IconDownload />
      </SubmitButton>
    </>
  );
};

export default ReviewDeposit;

const HeaderContainer = styled.div`
  display: flex;
  margin-bottom: ${2 * GU}px;
`;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 470px;
  padding-top: 22px;
  ::-webkit-scrollbar-track {
    background: #f6f9fc;
  }
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background: #eff1f7;
    border-radius: 12px;
  }
`;

const Title = styled.p`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  padding-left: 16px;
`;

const BackButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #eaf0fa;
  border-radius: 8px;
  width: 40px;
  height: 40px;
`;

const TransferContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0px 3px 3px rgba(180, 193, 228, 0.35);
  padding: 32px 16px 16px;
`;

const TransferTitle = styled.p`
  font-weight: 600;
  font-size: 20px;
  color: #20232c;
`;

const TransferSubtitle = styled.p`
  color: #7483ab;
  font-weight: 500;
  font-size: 14px;
`;

const AddressContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
`;

const AddressBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 12px;
  background: #ffffff;
  width: 100%;
`;

const TokenLink = styled(IconExternal)`
  color: #00c2ff;
  margin-left: 12px;
  cursor: pointer;
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  margin-top: 24px;
  background: #ffffff;
  width: 100%;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 14px 16px 14px 16px;
  border-bottom: solid 2px #f6f9fc;
`;

const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  padding: 14px 16px 14px 16px;
  border-bottom: solid 2px #f6f9fc;
`;

const InfoKey = styled.p`
  color: #7483ab;
  font-weight: 600;
  font-size: 16px;
`;

const InfoValue = styled.p`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  color: #20232c;
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  background: #e7f9ed;
  color: #218242;
  height: 40px;
  width: 40px;
  z-index: 1;
`;

const TransactionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const IconContainer = styled.div`
  padding: 8px;
  background: #f6f9fc;
  border-radius: 100%;
  position: absolute;
  top: -30px;
  z-index: 1;
`;

const CustomIconRight = styled(IconRight)`
  margin: 0px 10px 0px 10px;
  color: #b4c1e4;
  width: 60px;
`;

const AddressTitle = styled.p`
  color: #7483ab;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
`;

const AddressContent = styled.p`
  color: #20232c;
  font-weight: 600;
  font-size: 16px;
`;

const SubmitButton = styled(Button)`
  height: 48px;
  width: 100%;
  box-shadow: none;
  margin-top: 24px;

  & p {
    font-weight: 600;
    font-size: 16px;
    margin-right: 12px;
  }
`;
