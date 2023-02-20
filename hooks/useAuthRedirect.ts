import { useEffect } from "react";
import Router from "next/router";
import Cookie from "js-cookie";

export function useAuthRedirect() {
  // useEffect(() => {
  //   const token = Cookie.get("token") as string;
  //   const role = Cookie.get("role");
  //   if (!token) {
  //     Router.push("/auth/login");
  //   } else if (token && role === "Super Admin") {
  //     Router.push("/admin/dashboard");
  //   } else if (token && role === "User") {
  //     Router.push("/users/homeuser");
  //   }
  // }, []);
  useEffect(() => {
    const token = Cookie.get("token") as string;
    const role = Cookie.get("role");

    if (!token) {
      Router.push("/auth/login");
      return;
    }
    switch (role) {
      case undefined:
        // Wait for the role cookie to be set
        // You can display a loading spinner or some other indication that the
        // application is waiting for the cookie to be set

        // You can also use a timeout to prevent the loading spinner from
        // displaying for too long
        break;
      case "Super Admin":
        Router.push("/admin/dashboard");
        break;
      case "User":
        Router.push("/users/homeuser");
        break;
      default:
        // Handle unexpected role value
        break;
    }
  }, []);
}
