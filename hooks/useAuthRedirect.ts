import { useEffect } from "react";
import Router from "next/router";
import Cookie from "js-cookie";

export function useAuthRedirect() {
  useEffect(() => {
    const token = Cookie.get("token") as string;
    const role = Cookie.get("role");

    if (!token) {
      Router.push("/auth/login");
      return;
    }

    switch (role) {
      case undefined:
        setTimeout(() => {
          Router.push("/auth/login");
        }, 1000);
        break;
      case "Super Admin":
        Router.push("/admin/dashboard");
        break;
      case "User":
        Router.push("/users/main");
        break;
      default:
        // Handle unexpected role value
        Router.push("/auth/login");
        break;
    }
  }, []);
}
