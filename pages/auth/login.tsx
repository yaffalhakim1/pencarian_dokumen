import { useState, useEffect, useContext } from "react";
import { AxiosError } from "axios";
import AuthContext from "../../context/AuthProvider";
import axios from "axios";
import Router from "next/router";
import Cookie from "js-cookie";
import SnackbarAlert from "../../components/snackbar";

function LoginForm(this: any) {
  const { setAuth } = useContext<any>(AuthContext);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [field, setField] = useState({ username: "", password: "" });

  function fieldHandler(e: any) {
    setField({
      ...field,
      [e.target.name]: e.target.value,
    });
  }

  async function handleLogin(e: any) {
    e.preventDefault();
    try {
      const loginReq = await axios.post(
        "https://spda-api.onrender.com/api/auth/login",
        {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          username: field.username,
          password: field.password,
        }
      );
      const loginResp = await loginReq.data;
      if (loginReq.status === 200) {
        setAuth(loginResp);
        Cookie.set("token", loginResp.token);
        Router.push("/admin/dashboard");
      }
    } catch (error) {
      const err = error as AxiosError;
      console.log(err);
      setShowSnackbar(true);
    }
  }

  return (
    <>
      <section className="h-screen">
        <div className="container px-6 py-12 h-full">
          <div className=" md:w-8/12 lg:w-6/12 mb-12 md:mb-0">
            {showSnackbar && <SnackbarAlert message="Login gagal" />}
          </div>
          <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
            <div className="md:w-8/12 lg:w-6/12 mb-12 md:mb-0">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                className="w-full"
                alt="Phone image"
              />
            </div>
            <div className="md:w-8/12 lg:w-5/12 lg:ml-20">
              <form>
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
                  type="button"
                  onClick={handleLogin}
                  className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                >
                  Sign in
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
