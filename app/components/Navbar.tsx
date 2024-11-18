import BtnPrimarySm from "./BtnPrimarySm";

interface NavbarProps {}

const Navbar = ({}: NavbarProps) => {
  return (
    <header className="flex py-10 items-center justify-between fixed bg-white-custom border-2 border-b-black-custom z-10 px-8 mx-auto top-0 right-0 left-0 h-16">
      <h1 className="text-xl font-source-serif font-bold">
        Baitul Hikmah Al-Fityah
      </h1>
      <nav className="flex-1 pr-24">
        <ul className="flex text- items-center justify-center gap-4 font-source-sans font-bold">
          <li>
            <a href="#">Tentang</a>
          </li>
          <li>
            <a href="#">Papan Peringkat</a>
          </li>
          <li>
            <a href="#">Fitur</a>
          </li>
        </ul>
      </nav>
      <BtnPrimarySm label="Masuk" width="" />
    </header>
  );
};

export default Navbar;
