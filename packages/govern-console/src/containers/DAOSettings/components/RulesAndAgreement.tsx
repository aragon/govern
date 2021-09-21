import { Link, StyledText, useTheme } from '@aragon/ui';

import { IPFSInput } from 'components/Field/IPFSInput';
import { ANCircularProgressWithCaption } from 'components/CircularProgress/ANCircularProgressWithCaption';
import { CircularProgressStatus, ipfsMetadata as IPFSMetadataType } from 'utils/types';

type Props = {
  isLoading: boolean;
  ipfsMetadata: IPFSMetadataType | undefined;
};

const RulesAndAgreement: React.FC<Props> = ({ isLoading, ipfsMetadata }) => {
  const { disabledContent } = useTheme();

  return isLoading ? (
    <ANCircularProgressWithCaption
      caption="Fetching Rules from IPFS"
      state={CircularProgressStatus.InProgress}
    />
  ) : (
    <IPFSInput
      title={'Rules / Agreement'}
      subtitle={
        <StyledText name={'title4'} style={{ color: disabledContent }}>
          Your DAO has optimistic capabilities, meaning that transactions can happen without voting,
          but should follow pre defined rules. Please provide the main agreement for your DAO (In
          text, or upload a file). You can use{' '}
          <Link href="https://docs.google.com/document/d/1HkSiJtjqiTCMbCagn2ev5iv_fG_PpfJcI-NqebmQzng/">
            this template
          </Link>{' '}
          to create your agreement.
        </StyledText>
      }
      placeholder="Please insert your DAO agreement"
      ipfsMetadata={ipfsMetadata}
      shouldUnregister={false}
      textInputName="daoConfig.rules"
      fileInputName="rulesFile"
      isFile="isRuleFile"
      rows={6}
    />
  );
};

export default RulesAndAgreement;
