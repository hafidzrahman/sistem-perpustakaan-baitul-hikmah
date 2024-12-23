"use client";

import BtnPrimary from "@/app/components/BtnPrimary";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { LegacyRef, MutableRefObject, useRef } from "react";
import { useRouter } from "next/navigation";

interface LoginPageProps {}

const LoginPage = ({}: LoginPageProps) => {
  const { push } = useRouter();
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const data = useSession();
  console.log(data);

  async function handleOnClick() {
    try {
      if (username.current && password.current) {
        const res = await signIn("credentials", {
          redirect: false,
          username: username.current.value,
          password: password.current.value,
          callbackUrl: "/panel-kontrol",
        });
        if (!res?.error) {
          push(`/panel-kontrol`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex overflow-hidden items-center justify-center flex-col gap-8 h-screen relative bg-noise bg-repeat bg-center">
      <Image
        src={"/img/lib-2.png"}
        alt="lib-photo"
        width={192 * 2}
        height={0}
        className="absolute -right-12 top-12 border-2 border-black-custom rounded-lg "
      />
      <Image
        src={"/img/lib-1.png"}
        alt="lib-photo"
        width={192 * 2}
        height={0}
        className="absolute -left-12 bottom-32 border-2 border-black-custom rounded-lg "
      />
      <Image
        src={"/img/pencil.png"}
        alt="lib-photo"
        width={192 * 2}
        height={0}
        className="absolute bottom-1/4 right-48"
      />
      <Image
        src={"/img/line.png"}
        alt="lib-photo"
        width={192}
        height={0}
        className="absolute -left-4 -top-0"
      />
      <h1 className="text-5xl tracking-wide leading-none font-black font-source-serif text-black">
        Baitul Hikmah Al-Fityah
      </h1>
      <section className="flex relative z-10 bg-white-custom gap-4 border-2 w-[40%] border-black rounded-lg p-10 flex-col ">
        <h2 className="font-source-sans leading-none text-2xl font-bold text-black">
          Assalamu'alaikum
        </h2>
        <h3 className="font-source-sans text-xl font-bold">
          Hai,{" "}
          <a
            target="_blank"
            href="https://id.wikipedia.org/wiki/Bibliofilia"
            className="font-source-serif italic text-secondary underline"
          >
            bibliophile
            <span className="no-underline">!</span>
          </a>
        </h3>
        <p className="font-source-sans">
          Selamat datang di Baitul Hikmah Al-Fityah, silakan masukkan identitas
          Anda, untuk mengakses sistem
        </p>
        <div className="flex flex-col gap-2">
          <label htmlFor="id" className="font-source-serif text-xl font-bold">
            NISN / NIP
          </label>
          <input
            name="username"
            type="text"
            id="id"
            placeholder="Masukkan NISN atau NIP"
            className="py-2 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs placeholder:font-source-sans"
            ref={username}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="font-source-serif text-xl font-bold"
          >
            Kata Sandi
          </label>
          <input
            name="password"
            type="password"
            id="password"
            placeholder="Masukkan kata sandi"
            className="py-2 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs placeholder:font-source-sans"
            ref={password}
          />
        </div>
        <p className="text-xs font-source-sans ml-1 underline">
          Lupa kata sandi?
        </p>
        <button
          className={`bg-dark-primary text-white-custom font-source-sans leading-none text-sm font-normal rounded-lg border-2 border-black-custom py-4 px-14`}
          onClick={handleOnClick}
        >
          Masuk
        </button>
      </section>
    </div>
  );
};

export default LoginPage;
