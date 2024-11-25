interface BtnSecondaryProps {
  label: string;
  onClick?: () => void;
  icon?: React.ElementType;
}

const BtnSecondary = ({ label, onClick, icon: Icon }: BtnSecondaryProps) => {
  return (
    <button
      onClick={onClick}
      className={`bg-transparent flex justify-between items-center gap-2 text-light-primary font-source-sans leading-none text-xs font-normal rounded-md border-2 border-light-primary py-2 transition-all duration-300 hover:font-bold hover:shadow-sm ${
        Icon ? "pl-6 pr-4" : "pl-4 pr-4"
      } hover:transition-all hover:duration-300`}
    >
      {label}
      {Icon && <Icon width={20} height={20} />}
    </button>
  );
};

export default BtnSecondary;
