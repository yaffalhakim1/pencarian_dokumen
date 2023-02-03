import { useState, useEffect, useContext, createContext } from "react";
import { AxiosError } from "axios";
import AuthContext from "../../context/AuthProvider";
import axios from "axios";
import Router, { useRouter } from "next/router";
import Cookie from "js-cookie";

import { TailSpin } from "react-loader-spinner";
import Head from "next/head";
import Image from "next/image";

function LoginForm(this: any) {
  const router = useRouter();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [field, setField] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  function fieldHandler(e: any) {
    setField({
      ...field,
      [e.target.name]: e.target.value,
    });
  }

  async function handleLogin(event: React.SyntheticEvent) {
    event.preventDefault();
    try {
      const loginReq = await axios.post(
        "https://spda-api.onrender.com/api/auth/login",
        {
          headers: {
            "Content-Type": "application/json",
          },
          username: field.username,
          password: field.password,
        }
      );
      const loginResp = await loginReq.data;
      setLoading(false);
      if (loginReq.status === 200) {
        Cookie.set("name", loginResp.data.name);
        Cookie.set("token", loginResp.token);
        Cookie.set("role", loginResp.data.role_id);
        console.log(loginResp);
        router.push("/admin/dashboard");
      }
    } catch (error) {
      const err = error as AxiosError;
      console.log(err);
      setLoading(false);
      setShowSnackbar(true);
    }
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <section className="h-screen">
        <div className="container px-6 py-12 h-full">
          <div className=" md:w-8/12 lg:w-6/12 mb-12 md:mb-0">
            {showSnackbar && (
              <div className="alert alert-error shadow-md">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current flex-shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    Login gagal, silakan masukkan username dan password dengan
                    benar
                  </span>
                </div>
              </div>
            )}
          </div>
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
              <form onSubmit={handleLogin}>
                <div className="mb-6">
                  <input
                    type="text"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    placeholder="Email address"
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
                    "Sign In"
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

export default LoginForm;
