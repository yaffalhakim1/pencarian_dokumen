import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import Router from "next/router";
import Cookie from "js-cookie";

export default function HomeUser() {
  const { auth } = useContext<any>(AuthContext);

  // create a logout

  function logoutHandler(e: { preventDefault: () => void }) {
    e.preventDefault();
    Cookie.remove("token");
    Router.replace("/auth/login");
  }

  return (
    <section>
      <div>
        <h1 className="text-white">Home</h1>
        <button onClick={logoutHandler}>logout</button>
      </div>
    </section>
  );
}
