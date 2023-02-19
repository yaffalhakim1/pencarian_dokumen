import Link from "next/link";
import { useEffect } from "react";
import "tailwindcss/tailwind.css";
import HomeUser from "./users/homeuser";
import Cookie from "js-cookie";
import Router from "next/router";
import { TailSpin } from "react-loader-spinner";

export default function Home() {
  const loginTime = Date.now();
  Cookie.set("login_time", loginTime.toString());
  useEffect(() => {
    const token = Cookie.get("token") as string;
    const expired = Cookie.get("expired_in") as string;
    const role = Cookie.get("role");
    const loginTime = Number(Cookie.get("login_time"));
    if (
      !token ||
      Date.now() >= Number(expired) * 1000 ||
      Date.now() - loginTime >= Number(expired) * 1000
    ) {
      Router.replace("/auth/login");
    } else if (token) {
      Router.push("/admin/dashboard");
    } else if (token && role === "2") {
      Router.push("/users/homeuser");
    }
  }, []);

  return (
    <>
      <div className="container flex mx-auto text-center justify-center items-center">
        <TailSpin color="#4B5563" height={40} width={40} />
        <p className="ml-5 text-lg text-center">Sedang memeriksa....</p>
      </div>
    </>
  );
}
