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

function LoginForm(this: any) {
  const router = useRouter();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [field, setField] = useState({ username: "", password: "" });
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

  async function handleLogin(event: React.SyntheticEvent) {
    event.preventDefault();

    try {
      const loginReq = await axios.post(
        "https://spda.17management.my.id/api/auth/login",
        {
          username: field.username,
          password: field.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );
      const expirationTime = Date.now() + loginReq.data.expired_in * 1000;
      authCtx.login(loginReq.data.access_token, expirationTime);
      const loginResp = await loginReq.data;
      setLoading(false);
      if (loginReq.status === 200) {
        Cookie.set("token", loginResp.access_token);
        Cookie.set("expired_in", loginResp.expired_in);
        router.push("/admin/dashboard");
      }
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.response?.data, "error login");
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
          <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
            <div className="md:w-8/12 lg:w-6/12 mb-12 md:mb-0">
              <Image
                src="/images/login.svg"
                alt="Phone image"
                width={600}
                height={600}
                className="hidden  md:block"
              />
            </div>
            <div className="md:w-8/12 lg:w-5/12 lg:ml-10">
              <form onSubmit={handleLogin} method="POST">
                <Image
                  src="/images/Undip.png"
                  alt="Undip"
                  width={150}
                  height={150}
                  className="flex mx-auto mb-4"
                />
                <h1 className="font-bold text-xl text-center mb-2">Login</h1>
                <p className="font-normal text-md text-center mb-6 text-slate-400">
                  Untuk masuk ke aplikasi anda
                </p>
                <div className="mb-6">
                  <div className="text-lg font-bold text-gray-700 tracking-wide">
                    Username
                  </div>
                  <input
                    type="text"
                    // className="form-control block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
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
                    // className="form-control block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    className="w-full text-sm py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                    placeholder="Password"
                    name="password"
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
                      <span className="capitalize">Signing you in...</span>
                    </div>
                  ) : (
                    "Login"
                  )}
                </button>

                <div onClick={() => router.push("/auth/register")}>
                  <p className="text-slate-400 mt-3 text-sm text-center underline">
                    Belum memiliki akun? Daftar disini
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default LoginForm;
