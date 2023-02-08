import { useEffect } from "react";
import Router from "next/router";
import Cookie from "js-cookie";

export function useAuthRedirect() {
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
}
