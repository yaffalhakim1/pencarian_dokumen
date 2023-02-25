import { SetStateAction, useContext, useEffect, useState } from "react";
import Router from "next/router";
import Cookie from "js-cookie";

import Head from "next/head";
import { MoonLoader } from "react-spinners";
import SwitchTheme from "../../components/Switcher";
import { useAuthRedirect } from "../../hooks/useAuthRedirect";
import axios from "axios";
import CrudDocument from "./documents";
import CrudAlat from "./users";
import { GetServerSideProps } from "next";
import CrudDevices from "./devices";
import CrudUsers from "./users";
import CrudTags from "./tag";

export default function DashboardAdmin() {
  const [selectedItem, setSelectedItem] = useState(1);
  const [loading, setLoading] = useState(false);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  const handleClick = (item: SetStateAction<number>) => {
    setSelectedItem(item);
  };

  useAuthRedirect();

  // get profile

  useEffect(() => {
    getProfile();
  }, []);

  async function logoutHandler() {
    Cookie.remove("token");
    Cookie.remove("expired_in");
    const token = Cookie.get("token") as string;
    const logout = await axios
      .post("https://spda.17management.my.id/api/auth/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res);
      })
      .catch((err) => {
        // console.log(err);
      });

    setLoading(false);
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

  // const name = data.name;

  return (
    <>
      <Head>
        <title>Dashboard Admin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className=" font-semibold ml-4 mt-5 mr-4">
        <div className="flex  items-center">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-sm btn-primary drawer-button lg:hidden mr-4 capitalize"
          >
            Menu
          </label>
          <div>
            <h1 className="hidden md:flex mb-5">Dashboard Admin</h1>
            <div className="flex items-center space-x-3 mr-4 md:mr-0">
              <div className="avatar placeholder">
                <div className="mask mask-squircle w-10 h-10 text-center bg-neutral-focus text-neutral-content">
                  {/* <img src="/tailwind-css-component-profile-2@56w.png" alt="Avatar Tailwind CSS Component" /> */}
                  {userName.charAt(0)}
                </div>
              </div>
              <div>
                <div className="font-bold">{userName}</div>
                <div className="text-sm opacity-50">{email}</div>
              </div>
            </div>
            {/* <SwitchTheme /> */}
          </div>
        </div>
      </div>
      <div className="drawer drawer-mobile">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          {selectedItem === 1 && <CrudDocument />}
          {selectedItem === 2 && <CrudUsers />}
          {selectedItem === 3 && <CrudDevices />}
          {selectedItem === 4 && <CrudTags />}
        </div>

        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 bg-base-100 text-base-content">
            <li>
              <a
                className={
                  selectedItem === 1 ? "active font-semibold text-white" : ""
                }
                onClick={() => handleClick(1)}
              >
                Dokumen
              </a>
            </li>
            <li>
              <a
                className={
                  selectedItem === 2 ? "active font-semibold text-white" : ""
                }
                onClick={() => handleClick(2)}
              >
                Users
              </a>
            </li>
            <li>
              <a
                className={
                  selectedItem === 3 ? "active font-semibold text-white" : ""
                }
                onClick={() => handleClick(3)}
              >
                Alat
              </a>
            </li>
            <li>
              <a
                className={
                  selectedItem === 4 ? "active font-semibold text-white" : ""
                }
                onClick={() => handleClick(4)}
              >
                Tags
              </a>
            </li>
            <li className="">
              <a
                className="btn btn-error text-white mt-5 py-3"
                //setloading true onclick
                onClick={logoutHandler}
              >
                {loading ? (
                  <div className="flex flex-row items-center">
                    <MoonLoader color="#fff" size={20} className="mr-3" />
                    <span className="text-white">Loading...</span>
                  </div>
                ) : (
                  "Logout"
                )}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
