import styled from 'styled-components';
import { Box, Tag, IconRight, GU } from '@aragon/ui';

type Props = {
  date: string;
  state: string;
  title: string | null;
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
  & > div {
    width: 100%;
  }
  & > div > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const Lable = styled(Tag)`
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
`;

const Time = styled.p`
  font-weight: 500;
  font-size: 14px;
  line-height: 150%;
  color: #7483ab;
  margin-top: 4px;
`;

const LableContainer = styled.div`
  display: flex;
`;

const DaoActionCard: React.FC<Props> = ({ date, state, title }) => {
  return (
    <ActionCard>
      <TextContainer>
        <Text>{title}</Text>
        <Time>{date}</Time>
      </TextContainer>
      <LableContainer>
        <Lable className={state.toLowerCase().replace(' ', '_')}>{state}</Lable>
        <IconRight
          css={`
            margin-left: ${3 * GU}px;
            color: #7483ab;
          `}
        />
      </LableContainer>
    </ActionCard>
  );
};

export default DaoActionCard;
