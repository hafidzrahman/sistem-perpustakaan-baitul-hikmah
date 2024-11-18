interface BtnPrimaryProps {
  label: string;
  onclick?: () => void;
  type?: string;
}

const BtnPrimary = ({ label, onclick }: BtnPrimaryProps) => {
  return (
    <button
      onClick={onclick}
      className={`bg-dark-primary text-white-custom font-source-sans leading-none text-sm font-normal rounded-lg border-2 border-black-custom py-2 px-14`}
    >
      {label}
    </button>
  );
};

export default BtnPrimary;
