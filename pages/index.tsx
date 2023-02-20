import Link from "next/link";
import { useEffect } from "react";
import "tailwindcss/tailwind.css";
import HomeUser from "./users/homeuser";
import Cookie from "js-cookie";
import Router from "next/router";
import { TailSpin } from "react-loader-spinner";
import axios from "axios";

export default function Home() {
  const loginTime = Date.now();
  Cookie.set("login_time", loginTime.toString());
  const token = Cookie.get("token") as string;
  const role = Cookie.get("role") as string;

  async function logoutHandler() {
    Cookie.remove("token");
    Cookie.remove("expired_in");
    const token = Cookie.get("token") as string;
    const logout = await axios
      .post("https://spda.17management.my.id/api/auth/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res, "logout otomatis");
        Router.push("/auth/login");
      })
      .catch((err) => {
        // console.log(err);
      });
  }

  useEffect(() => {
    const expired = Cookie.get("expired_in") as string;
    const loginTime = Number(Cookie.get("login_time"));
    if (
      !token ||
      Date.now() >= Number(expired) * 1000 ||
      Date.now() - loginTime >= Number(expired) * 1000
    ) {
      Cookie.remove("token");
      Cookie.remove("expired_in");
      Cookie.remove("login_time");
      logoutHandler();
      Router.push("/auth/login");
    } else if (
      role === "Super Admin" &&
      token &&
      Date.now() < Number(expired) * 1000
    ) {
      Router.push("/admin/dashboard");
    } else if (
      role === "User" &&
      token &&
      Date.now() < Number(expired) * 1000
    ) {
      Router.push("/users/homeuser");
    }
  }, [token]);

  return (
    <>
      <div className="container mx-auto">
        <div className="flex text-center justify-center items-center">
          <TailSpin color="#4B5563" height={40} width={40} />
          <p className="ml-5 text-lg text-center">Sedang memeriksa....</p>
        </div>
      </div>
    </>
  );
}
