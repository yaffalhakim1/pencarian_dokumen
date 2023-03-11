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
      case "Operator":
        Router.push("/operator/dashboard");
        break;
      case "User":
        Router.push("/users/main");
        break;
      case "Admin":
        Router.push("/admin/dashboard");
      case "Manager":
        Router.push("/manager/dashboard");
      case "Supervisor":
        Router.push("/supervisor/dashboard");
      case "User":
        if (Router.route.startsWith("/operator")) {
          Router.push("/auth/unauthorized");
        }
        break;
      default:
        // Handle unexpected role value
        Router.push("/auth/login");
        break;
    }
  }, []);
}
