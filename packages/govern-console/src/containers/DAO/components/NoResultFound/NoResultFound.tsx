import styled from 'styled-components';

const Container = styled.strong`
  text-align: center;
`;

type props = {
  type: string;
};

const NoResultFound: React.FC<props> = ({ type }) => {
  return <Container>No {type} available!</Container>;
};

export default NoResultFound;
