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
  }, []);
}
