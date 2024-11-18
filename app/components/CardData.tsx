interface CardDataProps {
  number: string;
  label: string;
  icon: React.ElementType;
}

const CardData = ({ number, label, icon: Icon }: CardDataProps) => {
  return (
    <div>
      <h1>CardData</h1>
    </div>
  );
};

export default CardData;
