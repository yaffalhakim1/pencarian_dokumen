import Link from "next/link";
import { useEffect } from "react";
import "tailwindcss/tailwind.css";
import HomeUser from "./users/homeuser";
import Cookie from "js-cookie";
import Router from "next/router";
import { TailSpin } from "react-loader-spinner";

export default function Home() {
  useEffect(() => {
    const token = Cookie.get("token") as string;
    const role = Cookie.get("role");
    if (!token) {
      Router.push("/auth/login");
    } else if (token) {
      Router.push("/admin/dashboard");
    } else if (token && role === "2") {
      Router.push("/users/homeuser");
    }
  }, []);

  return (
    <>
      <div className="container">
        <div className="flex mx-auto text-center justify-center items-center">
          <TailSpin color="#4B5563" height={40} width={40} />
          <p className="ml-5 text-lg">Sedang memeriksa....</p>
        </div>
      </div>
    </>
  );
}
