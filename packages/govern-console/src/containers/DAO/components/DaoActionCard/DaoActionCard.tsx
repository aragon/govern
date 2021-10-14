import styled from 'styled-components';
import { Box, Tag, IconRight, GU, useLayout } from '@aragon/ui';
import { formatDate } from 'utils/date';
import { useHistory } from 'react-router-dom';
import { toUTF8String } from 'utils/lib';

type Props = {
  date: string;
  state: string;
  title: string | null;
  dao_identifier: string;
  id: string;
};

const ActionCard = styled(Box).attrs(() => ({
  padding: 16,
}))`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border-radius: 16px;
  width: 100%;
  border: none;
  cursor: pointer;
  max-width: 455px;
  & > div {
    width: 100%;
  }
  & > div > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const Label = styled(Tag)`
  border-radius: 4px;
  color: white;
  &.executable {
    background: #00c2ff;
  }
  &.scheduled {
    background: #ffbc5b;
  }
  &.challenged {
    background: linear-gradient(107.79deg, #ff7984 1.46%, #ffeb94 100%);
  }
  &.executed {
    background: #46c469;
  }
  &.ruled_negatively {
    background: #ff6a60;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Text = styled.p`
  font-weight: 600;
  font-size: 16px;
  line-height: 125%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
`;

const Time = styled.p`
  font-weight: 500;
  font-size: 14px;
  line-height: 150%;
  color: #7483ab;
  margin-top: 4px;
`;

const LabelContainer = styled.div`
  display: flex;
`;

const DaoActionCard: React.FC<Props> = ({ id, date, state, title, dao_identifier }) => {
  const { layoutName } = useLayout();
  const history = useHistory();

  const getSlicedTransactionHash = () => {
    const hash = id.substring(0, 6) + '...' + id.substring(id.length - 5);
    return hash;
  };

  const getTitleTransaction = () => {
    const utfString = toUTF8String(title || '') || '{}'; // Check for title availability
    return JSON.parse(utfString).title;
  };

  const goToActionDetails = () => {
    history.push(`/daos/${dao_identifier}/actions/executions/${id}`);
  };

  return (
    <ActionCard onClick={goToActionDetails}>
      <TextContainer>
        <Text
          css={`
            width: ${layoutName === 'small' ? '100px' : '250px'};
          `}
        >
          {getTitleTransaction() || getSlicedTransactionHash()}
        </Text>
        <Time>{formatDate(date, 'relative')}</Time>
      </TextContainer>
      <LabelContainer>
        <Label className={state.toLowerCase().replace(' ', '_')}>{state}</Label>
        <IconRight
          css={`
            margin-left: ${3 * GU}px;
            color: #7483ab;
          `}
        />
      </LabelContainer>
    </ActionCard>
  );
};

export default DaoActionCard;
