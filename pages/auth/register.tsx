import { useRef, useState, useEffect, useContext } from "react";
import { AxiosError } from "axios";
import AuthContext from "../../context/AuthProvider";
import axios from "axios";
import Router from "next/router";

function RegisterForm() {
  const { setAuth } = useContext<any>(AuthContext);
  const userRef = useRef<any>();
  const errRef = useRef<any>();
  const [email, setUser] = useState("");
  const [password, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);
  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  //login code
  const register = async (email: any, password: any) => {
    try {
      const response = await axios.post("https:/reqres.in/api/login", {
        email: email,
        password: password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    try {
      const result = await register(email, password);
      setAuth(result);

      setSuccess(true);
      Router.push("/users/home");

      console.log(result);
    } catch (error) {
      console.log("error in login", error);
      setErrMsg("Login Failed");
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>loading..</h1>

          <br />
          <p>{/* <a href="#">Go to Home</a> */}</p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="email"
              name="email"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={email}
              required
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => setPwd(e.target.value)}
              value={password}
              required
            />
            <button>Sign In</button>
          </form>
          <p>
            Need an Account?
            <br />
            <span className="line">
              <a href="#">Sign Up</a>
            </span>
          </p>
        </section>
      )}
    </>
  );
}

export default RegisterForm;
