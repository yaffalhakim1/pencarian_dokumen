import { useEffect } from "react";
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

  useEffect(() => {
    const token = Cookie.get("token") as string;
    const role = Cookie.get("role");
    if (!token) {
      Router.push("/auth/login");
    } else if (token && role === "1") {
      Router.push("/admin/dashboard");
    } else if (token && role === "2") {
      Router.push("/users/homeuser");
    }
  }, []);

  return (
    <section>
      <div>
        <h1 className="text-white">Home</h1>
        <button onClick={logoutHandler}>logout</button>
      </div>
    </section>
  );
}
