"use client";

import BtnPrimary from "@/app/components/BtnPrimary";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LoginPageProps {}

const LoginPage = ({}: LoginPageProps) => {
  const { push } = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });

  const validateInputs = () => {
    let tempErrors = { username: "", password: "" };
    let isValid = true;

    if (!username.trim()) {
      tempErrors.username = "NIS/NIP harus diisi";
      isValid = false;
    }

    if (!password.trim()) {
      tempErrors.password = "Kata sandi harus diisi";
      isValid = false;
    } else if (password.length < 6) {
      tempErrors.password = "Kata sandi minimal 6 karakter";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  async function handleOnClick() {
    if (!validateInputs()) {
      return;
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        username: username,
        password: password,
        callbackUrl: "/panel-kontrol",
      });

      if (!res?.error) {
        toast.success("Login berhasil!");
        push(`/panel-kontrol`);
      } else {
        // Handle specific error cases
        if (res.error === "CredentialsSignin") {
          toast.error("NIS/NIP atau kata sandi yang dimasukkan salah");
        } else {
          toast.error("Terjadi kesalahan saat login");
        }
      }
    } catch (error) {
      // Network or connection errors
      toast.error("Gagal terhubung ke server. Periksa koneksi internet Anda");
      console.log(error);
    }
  }

  return (
    <div className="flex overflow-hidden items-center justify-center flex-col gap-4 md:gap-8 min-h-screen px-4 py-8 relative bg-noise bg-repeat bg-center">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Decorative Images - Hidden on mobile */}
      <Image
        src={"/img/lib-2.png"}
        alt="lib-photo"
        width={384}
        height={0}
        className="absolute -right-12 top-12 border-2 border-black-custom rounded-lg hidden lg:block"
      />
      <Image
        src={"/img/lib-1.png"}
        alt="lib-photo"
        width={384}
        height={0}
        className="absolute -left-12 bottom-32 border-2 border-black-custom rounded-lg hidden lg:block"
      />
      <Image
        src={"/img/pencil.png"}
        alt="lib-photo"
        width={384}
        height={0}
        className="absolute bottom-1/4 right-48 hidden lg:block"
      />
      <Image
        src={"/img/line.png"}
        alt="lib-photo"
        width={192}
        height={0}
        className="absolute -left-4 -top-0 hidden lg:block"
      />

      {/* Title */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl text-center tracking-wide leading-none font-black font-source-serif text-black">
        Baitul Hikmah Al-Fityah
      </h1>

      {/* Login Form */}
      <section className="flex relative z-10 bg-white-custom gap-4 border-2 w-full md:w-[80%] lg:w-[40%] border-black rounded-lg p-6 md:p-10 flex-col">
        <h2 className="font-source-sans leading-none text-xl md:text-2xl font-bold text-black">
          Assalamu'alaikum
        </h2>
        <h3 className="font-source-sans text-lg md:text-xl font-bold">
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
        <p className="font-source-sans text-sm md:text-base">
          Selamat datang di Baitul Hikmah Al-Fityah, silakan masukkan identitas
          Anda, untuk mengakses sistem
        </p>

        {/* Username Input */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="id"
            className="font-source-serif text-lg md:text-xl font-bold"
          >
            NIS / NIP
          </label>
          <input
            name="username"
            type="text"
            id="id"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Masukkan NIS atau NIP"
            className="py-2 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs placeholder:font-source-sans"
          />
          {errors.username && (
            <span className="text-red-500 text-xs mt-1">{errors.username}</span>
          )}
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="font-source-serif text-lg md:text-xl font-bold"
          >
            Kata Sandi
          </label>
          <input
            name="password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan kata sandi"
            className="py-2 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs placeholder:font-source-sans"
          />
          {errors.password && (
            <span className="text-red-500 text-xs mt-1">{errors.password}</span>
          )}
        </div>

        <p className="text-xs font-source-sans ml-1 underline cursor-pointer hover:text-secondary">
          Lupa kata sandi?
        </p>

        {/* Login Button */}
        <button
          className="bg-dark-primary text-white-custom font-source-sans leading-none text-sm font-normal rounded-lg border-2 border-black-custom py-3 md:py-4 px-8 md:px-14 hover:bg-opacity-90 transition-all duration-300"
          onClick={handleOnClick}
        >
          Masuk
        </button>
      </section>
    </div>
  );
};

export default LoginPage;
