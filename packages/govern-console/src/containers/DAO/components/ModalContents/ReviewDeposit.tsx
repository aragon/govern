import styled from 'styled-components';
import { IconLeft, IconDownload, GU, Button, IconRight } from '@aragon/ui';

const HeaderContainer = styled.div`
  display: flex;
  padding-bottom: 10px;
  margin-bottom: ${3 * GU}px;
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
  justify-content: center;
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

const InfoRowKey = styled.p`
  color: #7483ab;
  font-weight: 600;
  font-size: 16px;
`;

const InfoRowValue = styled.p`
  font-weight: 600;
  font-size: 16px;
  color: #20232c;
  max-width: 200px;
  text-align: right;
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
  width: 70px;
  color: #b4c1e4;
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

const ReviewDeposit: React.FC = () => {
  return (
    <>
      <HeaderContainer>
        <BackButton>
          <IconLeft />
        </BackButton>
        <Title>Review transfer</Title>
      </HeaderContainer>
      <TransactionWrapper>
        <IconContainer>
          <Icon>
            <IconDownload />
          </Icon>
        </IconContainer>
        <TransferContainer>
          <TransferTitle>Deposit</TransferTitle>
          <TransferSubtitle>Review now</TransferSubtitle>
        </TransferContainer>
      </TransactionWrapper>
      <AddressContainer>
        <AddressBox>
          <AddressTitle>From</AddressTitle>
          <AddressContent>0xd5d....54f53</AddressContent>
        </AddressBox>
        <CustomIconRight />
        <AddressBox>
          <AddressTitle>To</AddressTitle>
          <AddressContent>Decentraland</AddressContent>
        </AddressBox>
      </AddressContainer>
      <InfoBox>
        <InfoRow>
          <InfoRowKey>Token</InfoRowKey>
          <InfoRowValue>GET</InfoRowValue>
        </InfoRow>
        <InfoRow>
          <InfoRowKey>Token Contract</InfoRowKey>
          <InfoRowValue>0x8a85....30c6a1b</InfoRowValue>
        </InfoRow>
        <InfoRow>
          <InfoRowKey>Amount</InfoRowKey>
          <InfoRowValue>+ 5,0002.03232 GET</InfoRowValue>
        </InfoRow>
        <InfoRow>
          <InfoRowKey>Reference</InfoRowKey>
          <InfoRowValue>Add GET as new governance token</InfoRowValue>
        </InfoRow>
      </InfoBox>
      <SubmitButton>
        <p>Sign deposit</p>
        <IconDownload />
      </SubmitButton>
    </>
  );
};

export default ReviewDeposit;
