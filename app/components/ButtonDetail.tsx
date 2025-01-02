import { useRouter } from "next/navigation";

interface ButtonDetailProps {
  isbn: string;
}

const ButtonDetail = ({ isbn }: ButtonDetailProps) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/buku/${isbn}`)}
      className="bg-primary w-full text-white-custom font-source-sans leading-none text-xs rounded-md border-2 border-black-custom py-2 font-normal transition-all duration-300 hover:font-bold hover:shadow-sm hover:transition-all hover:duration-300"
    >
      Detail
    </button>
  );
};

export default ButtonDetail;
