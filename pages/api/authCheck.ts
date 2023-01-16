import { getCookie } from "cookies-next";
import { NextRequest } from "next/server";

export async function first(req: NextRequest) {
  // const token = req.cookies.get("token")?.value;
  const token = getCookie("token");

  if (!token) return { status: 401, body: "Unauthorized" };
}
