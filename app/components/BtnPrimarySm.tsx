interface BtnPrimarySmProps {
  label: string;
  width?: string;
  onclick?: () => void;
}

const BtnPrimarySm = ({
  label,
  width = "full",
  onclick,
}: BtnPrimarySmProps) => {
  return (
    <button
      onClick={onclick}
      className={`bg-dark-primary w-${width} text-white-custom font-source-sans leading-none text-sm rounded-lg border-2 border-black-custom py-2 px-10 font-light`}
    >
      {label}
    </button>
  );
};

export default BtnPrimarySm;
