import { useContext } from "react";
import Router from "next/router";
import Cookie from "js-cookie";

export default function HomeUser() {
  // create a logout

  function logoutHandler(e: { preventDefault: () => void }) {
    e.preventDefault();
    Cookie.remove("token");
    Cookie.remove("name");
    Cookie.remove("role");
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
