import { useEffect } from "react";
import Router from "next/router";
import Cookie from "js-cookie";
import { useAuthRedirect } from "../../hooks/useAuthRedirect";
import axios from "axios";

export default function HomeUser() {
  // create a logout

  async function logoutHandler(e: { preventDefault: () => void }) {
    e.preventDefault();
    Cookie.remove("role");
    Cookie.remove("token");
    Cookie.remove("expired_in");
    Cookie.remove("login_time");
    const token = Cookie.get("token") as string;
    const logout = await axios
      .post("https://spda.17management.my.id/api/auth/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res);
      })
      .catch((err) => {
        // console.log(err);
      });

    Router.replace("/auth/login");
  }

  useAuthRedirect();

  return (
    <section>
      <div>
        <h1 className="">Home user</h1>
        <button onClick={logoutHandler}>logout</button>
      </div>
    </section>
  );
}
