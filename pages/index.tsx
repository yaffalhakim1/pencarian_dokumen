import Link from "next/link";
import { useEffect } from "react";
import "tailwindcss/tailwind.css";
import HomeUser from "./users/homeuser";
import Cookie from "js-cookie";
import Router from "next/router";

export default function Home() {
  useEffect(() => {
    const token = Cookie.get("token") as string;
    if (!token) {
      Router.push("/auth/login");
    }
  }, []);

  return (
    <>
      <p>
        <Link href="/admin" passHref>
          Go to about page (will redirect)
        </Link>
      </p>
      <p>
        <Link href="/users" passHref>
          Go to another page (will rewrite)
        </Link>
      </p>

      <HomeUser />
    </>
  );
}
