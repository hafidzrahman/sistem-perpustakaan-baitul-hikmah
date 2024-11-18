interface BtnSecondaryProps {
  label: string;
  onClick: () => void;
  icon?: React.ElementType;
}

const BtnSecondary = ({ label, onClick, icon: Icon }: BtnSecondaryProps) => {
  return (
    <button
      onClick={onClick}
      className={`bg-transparent flex justify-between items-center gap-2 text-primary font-source-sans leading-none text-xs font-normal rounded-md border-2 border-primary py-2 px-4 transition-all duration-300
        hover:bg-primary hover:text-white-custom hover:border-black-custom hover:transition-all hover:duration-300`}
    >
      {label}
      {Icon && <Icon width={20} height={20} />}
    </button>
  );
};

export default BtnSecondary;
