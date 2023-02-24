import { useEffect, useState } from "react";
import Router from "next/router";
import Cookie from "js-cookie";
import { useAuthRedirect } from "../../hooks/useAuthRedirect";
import axios from "axios";

export default function HomeUser() {
  useAuthRedirect();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  async function logoutHandler(e: { preventDefault: () => void }) {
    e.preventDefault();
    Cookie.remove("role");
    Cookie.remove("token");
    Cookie.remove("expired_in");
    Cookie.remove("login_time");
    const token = Cookie.get("token") as string;
    const logout = await axios
      .post("https://spda.17management.my.id/api/auth/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res, "logged out from user role");
      })
      .catch((err) => {
        // console.log(err);
      });

    Router.replace("/auth/login");
  }

  async function getProfile() {
    const token = Cookie.get("token") as string;
    const profile = await axios
      .get("https://spda.17management.my.id/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data.data;
        setUserName(data.name);
        setEmail(data.email);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="flex justify-between">
      <div className="form-control">
        <div className="input-group">
          <input
            type="text"
            placeholder="Search…"
            className="input input-bordered"
          />
          <button className="btn btn-square">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="dropdown dropdown-end">
        <label
          tabIndex={0}
          className="btn  mask mask-squircle w-10 h-10 text-center bg-neutral-focus text-neutral-content"
        >
          <div className="w-10 rounded-full">{userName.charAt(0)}</div>
        </label>
        <ul
          tabIndex={0}
          className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
        >
          <li>
            <a className="justify-between">Profile</a>
          </li>
          <li>
            <a>Settings</a>
          </li>
          <li>
            <button
              className="btn btn-error capitalize"
              onClick={logoutHandler}
            >
              logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
