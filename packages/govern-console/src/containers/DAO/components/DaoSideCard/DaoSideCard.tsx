type Props = {
  baseUrl: string;
};

const DaoSideCard: React.FC<Props> = ({ baseUrl }) => {
  return <div>DAO Side Card: {baseUrl}</div>;
};

export default DaoSideCard;
