import React from "react";
import { useState, useEffect, useContext, createContext } from "react";
import { AxiosError } from "axios";
import axios from "axios";
import Router, { useRouter } from "next/router";
import Cookie from "js-cookie";

import { TailSpin } from "react-loader-spinner";
import Head from "next/head";
import Image from "next/image";
import Alert from "../../components/Alert";
import { AuthContext } from "../../hooks/AuthContext";

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
  const authCtx = useContext(AuthContext);

  function fieldHandler(e: any) {
    setField({
      ...field,
      [e.target.name]: e.target.value,
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
          role: field.role,
        },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );
      //   const expirationTime = Date.now() + loginReq.data.expired_in * 1000;
      //   authCtx.login(loginReq.data.access_token, expirationTime);
      const registerResp = await registerReq.data;
      setLoading(false);
      if (registerReq.status === 200) {
        router.push("/auth/login");
      }
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.response?.data, "error register");
      setLoading(false);
      setShowSnackbar(true);
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
                <h1 className="text-white font-bold text-xl text-center mb-6">
                  Register
                </h1>
                <div className="mb-6">
                  <input
                    type="text"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    placeholder="Name"
                    name="name"
                    onChange={fieldHandler}
                    required
                  />
                </div>
                <div className="mb-6">
                  <input
                    type="text"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    placeholder="Email"
                    name="email"
                    onChange={fieldHandler}
                    required
                  />
                </div>
                <div className="mb-6">
                  <input
                    type="text"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    placeholder="Username"
                    name="username"
                    onChange={fieldHandler}
                    required
                  />
                </div>

                <div className="mb-6">
                  <input
                    type="password"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    placeholder="Password"
                    name="password"
                    onChange={fieldHandler}
                    required
                  />
                </div>
                <div className="mb-6">
                  <input
                    type="password"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    placeholder="Confirm your password"
                    name="password_confirmation"
                    onChange={fieldHandler}
                    required
                  />
                </div>

                <div className="mb-6">
                  <input
                    type="text"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    placeholder="Role"
                    name="role"
                    onChange={fieldHandler}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
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
                      <span className="text-white">Signing you in...</span>
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

  return <div>Register</div>;
}
