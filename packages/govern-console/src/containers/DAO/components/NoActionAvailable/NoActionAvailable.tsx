import styled from 'styled-components';

const Container = styled.strong`
  text-align: center;
`;

const NoActionAvailable: React.FC = () => {
  return <Container>No actions available!</Container>;
};

export default NoActionAvailable;
