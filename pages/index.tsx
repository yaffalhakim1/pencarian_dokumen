import Link from "next/link";
import { useEffect } from "react";
import "tailwindcss/tailwind.css";
import HomeUser from "./users/home";
import Cookie from "js-cookie";
import Router from "next/router";
import { TailSpin } from "react-loader-spinner";
import axios from "axios";

export default function Home() {
  const loginTime = Date.now();
  const token = Cookie.get("token") as string;
  const role = Cookie.get("role") as string;
  // const expiredTime = Cookie.get("expired_in") as number;

  useEffect(() => {
    if (!token) {
      Router.push("/auth/login");
    } else if (role === "Super Admin" && token) {
      Router.push("/admin/dashboard");
    } else if (role === "User" && token) {
      Router.push("/users/main");
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
