import { SetStateAction, useEffect, useState } from "react";
import Router from "next/router";
import Cookie from "js-cookie";
import Head from "next/head";
import { MoonLoader } from "react-spinners";
import SwitchTheme from "../../components/Switcher";
import axios from "axios";
import CrudDocument from "./documents";
import CrudDevices from "./devices";
import CrudUsers from "../admin/users";
import CrudTags from "./tag";
import useSWR from "swr";
import CrudApproval from "./approval";
import CrudRoom from "./room";
import CrudTable from "./table";
import useRoleAuthorization from "../../hooks/useRoleAuth";

export default function DashboardAdmin() {
  const [selectedItem, setSelectedItem] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleClick = (item: SetStateAction<number>) => {
    setSelectedItem(item);
  };

  useRoleAuthorization(["Manager"]);

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

  // async function getProfile() {
  //   const token = Cookie.get("token") as string;
  //   const profile = await axios
  //     .get("https://spda.17management.my.id/api/users/profile", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((res) => {
  //       const data = res.data.data;
  //       setUserName(data.name);
  //       setEmail(data.email);
  //     })
  //     .catch((err) => {
  // console.log(err);
  //     });
  // }

  // const token = Cookie.get("token") as string;
  // const { data, error } = useSWR(
  //   `https://spda.17management.my.id/api/users/profile`,
  //   (url) =>
  //     axios
  //       .get(url, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((res) => res.data.data)
  // );

  // // if (error) return <div>Failed to load profile</div>;
  // if (!data) return <div>Loading...</div>;

  // const { name, email } = data;

  return (
    <>
      <Head>
        <title>Dashboard Manajer</title>
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
            <h1 className="hidden md:flex mb-5">Dashboard Manajer</h1>
            <div className="flex items-center space-x-3 mr-4 md:mr-0">
              <div className="avatar placeholder">
                {/* <div className="mask mask-squircle w-10 h-10 text-center bg-neutral-focus text-neutral-content">
                  {name.charAt(0)}
                </div> */}
              </div>
              <div>
                {/* <div className="font-bold">{name}</div>
                <div className="text-sm opacity-50">{email}</div> */}
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
          {/* {selectedItem === 2 && <CrudUsers />} */}
          {selectedItem === 2 && <CrudDevices />}
          {selectedItem === 3 && <CrudTags />}
          {selectedItem === 4 && <CrudRoom />}
          {selectedItem === 5 && <CrudTable />}
          {selectedItem === 6 && <CrudApproval />}
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
                Alat
              </a>
            </li>
            <li>
              <a
                className={
                  selectedItem === 3 ? "active font-semibold text-white" : ""
                }
                onClick={() => handleClick(3)}
              >
                Tags
              </a>
            </li>
            <li>
              <a
                className={
                  selectedItem === 4 ? "active font-semibold text-white" : ""
                }
                onClick={() => handleClick(4)}
              >
                Ruang
              </a>
            </li>
            <li>
              <a
                className={
                  selectedItem === 5 ? "active font-semibold text-white" : ""
                }
                onClick={() => handleClick(5)}
              >
                Meja
              </a>
            </li>
            <li>
              <a
                className={
                  selectedItem === 6 ? "active font-semibold text-white" : ""
                }
                onClick={() => handleClick(6)}
              >
                Approval
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
