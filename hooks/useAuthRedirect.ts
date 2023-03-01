import { useEffect } from "react";
import Router from "next/router";
import Cookie from "js-cookie";
import { toast } from "sonner";

export function useAuthRedirect() {
  useEffect(() => {
    const token = Cookie.get("token") as string;
    const role = Cookie.get("role");

    if (!token) {
      toast.error("Anda harus login terlebih dahulu");
      Router.push("/auth/login");
      return;
    } else if (token && role === undefined) {
      toast.error("Anda harus login terlebih dahulu");
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
      case "User":
        if (Router.route.startsWith("/admin")) {
          Router.push("/auth/unauthorized");
        } else {
          Router.push("/users/main");
        }
        break;
      default:
        // Handle unexpected role value
        Router.push("/auth/login");
        break;
    }
  }, []);
}
