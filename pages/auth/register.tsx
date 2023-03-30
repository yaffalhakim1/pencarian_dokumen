import React from "react";
import { useState, useEffect, useContext, createContext } from "react";
import { AxiosError } from "axios";
import axios from "axios";
import Router, { useRouter } from "next/router";
import Cookie from "js-cookie";
import Select from "react-select";

import { TailSpin } from "react-loader-spinner";
import Head from "next/head";
import Image from "next/image";
import { toast } from "sonner";
// import { AuthContext } from "../../hooks/AuthContext";

export default function Register() {
  const router = useRouter();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [field, setField] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    password_confirmation: "",
    role: [],
  });
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [expirationTime, setExpirationTime] = useState<any>(null);

  function fieldHandler(e: any) {
    setField({
      ...field,
      [e.target.name]: e.target.value,
    });
  }

  function handleSelectChange(e: any) {
    setField({
      ...field,
      role: e,
    });
  }

  async function logoutHandler() {
    Cookie.remove("token");
    Cookie.remove("name");
    Cookie.remove("role");
    const token = Cookie.get("token") as string;
    const logout = await axios
      .post("https://spda.17management.my.id/api/auth/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    setLoading(false);
    setToken(null);
    setExpirationTime(null);
    Router.replace("/auth/login");
  }

  // async function handleRegister(event: React.SyntheticEvent) {
  //   event.preventDefault();
  //   try {
  //     const registerReq = await axios.post(
  //       "https://spda.17management.my.id/api/auth/register",
  //       {
  //         name: field.name,
  //         email: field.email,
  //         username: field.username,
  //         password: field.password,
  //         password_confirmation: field.password_confirmation,
  //         role: "User",
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           accept: "*/*",
  //         },
  //       }
  //     );
  //     const registerResp = await registerReq.data;
  //     setLoading(false);
  //     if (registerReq.status === 200) {
  //       router.push("/auth/login");
  //     }
  //   } catch (error: any) {
  //     if (error.response.status === 400) {
  //       toast.error("Email atau username sudah terdaftar");
  //     } else if (error.response.status === 500) {
  //       toast.error("Register gagal, silakan coba lagi");
  //     } else {
  //       toast.error("Register gagal, silakan coba lagi");
  //     }

  //     setLoading(false);
  //     const err = error as AxiosError;
  //   }
  // }

  async function handleRegister(event: React.SyntheticEvent) {
    event.preventDefault();
    try {
      const registerReq = await axios.post(
        "https://spda.17management.my.id/api/auth/register",
        {
          name: field.name,
          email: field.email,
          username: field.username,
          password: field.password,
          password_confirmation: field.password_confirmation,
          role: "User",
        },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );
      const registerResp = await registerReq.data;
      setLoading(false);
      if (registerReq.status === 200) {
        toast.success("Register berhasil");
        router.push("/auth/login");
      }
    } catch (error: any) {
      if (error.response.status === 500) {
        toast.error("Register gagal, silakan coba lagi");
      } else if (
        error.response.data &&
        error.response.data.message &&
        typeof error.response.data.message === "object"
      ) {
        const errors = error.response.data.message;
        for (const field in errors) {
          errors[field].forEach((error: string) => {
            toast.error(error);
          });
        }
      } else {
        toast.error("Register gagal, silakan coba lagi");
      }
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <section className="h-screen">
        <div className="container px-6 py-12 h-full">
          <div className=" md:w-8/12 lg:w-6/12 mb-12 md:mb-0"></div>
          <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
            <div className="md:w-8/12 lg:w-6/12 mb-12 md:mb-0">
              <Image
                src="/images/login.svg"
                alt="Phone image"
                width={700}
                height={700}
              />
            </div>
            <div className="md:w-8/12 lg:w-5/12 lg:ml-20">
              <form onSubmit={handleRegister} method="POST">
                <Image
                  src="/images/Undip.png"
                  alt="Undip"
                  width={150}
                  height={150}
                  className="flex mx-auto mb-4"
                />
                <h1 className="font-bold text-xl text-center mb-2">Register</h1>
                <p className="font-normal text-md text-center mb-4 text-slate-400">
                  Silakan daftarkan akun anda terlebih dahulu
                </p>
                <div className="mb-6">
                  <div className="text-lg font-bold text-gray-700 tracking-wide">
                    Name
                  </div>
                  <input
                    type="text"
                    className="w-full text-sm py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                    placeholder="Name"
                    name="name"
                    onChange={fieldHandler}
                    required
                  />
                </div>
                <div className="mb-6">
                  <div className="text-lg font-bold text-gray-700 tracking-wide">
                    Email
                  </div>
                  <input
                    type="text"
                    className="w-full text-sm py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                    placeholder="Email"
                    name="email"
                    onChange={fieldHandler}
                    required
                  />
                </div>
                <div className="mb-6">
                  <div className="text-lg font-bold text-gray-700 tracking-wide">
                    Username
                  </div>
                  <input
                    type="text"
                    className="w-full text-sm py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                    placeholder="Username"
                    name="username"
                    onChange={fieldHandler}
                    required
                  />
                </div>

                <div className="mb-6">
                  <div className="text-lg font-bold text-gray-700 tracking-wide">
                    Password
                  </div>
                  <input
                    type="password"
                    className="w-full text-sm py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                    placeholder="Password (minimum 8 characters)"
                    name="password"
                    onChange={fieldHandler}
                    // pattern=".{8,}"
                    title="Password must be at least 8 characters long"
                    required
                  />
                </div>
                <div className="mb-6">
                  <div className="text-lg font-bold text-gray-700 tracking-wide">
                    Confirm your password
                  </div>
                  <input
                    type="password"
                    className="w-full text-sm py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                    placeholder="Re-type your password"
                    name="password_confirmation"
                    onChange={fieldHandler}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full capitalize text-white"
                  onClick={() => setLoading(true)}
                >
                  {loading ? (
                    <div className="flex flex-row items-center">
                      <TailSpin
                        height="20"
                        width="20"
                        color="#ffffff"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                        wrapperStyle={{}}
                        wrapperClass="mr-3"
                        visible={true}
                      />
                      <span className="text-white">Silakan tunggu...</span>
                    </div>
                  ) : (
                    "Daftar"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
