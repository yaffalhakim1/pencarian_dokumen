import { SetStateAction, useContext, useEffect, useState } from "react";
import Router from "next/router";
import Cookie from "js-cookie";
import CrudDocument from "./documents";
import CrudAlat from "./tools";
import Head from "next/head";
import { MoonLoader } from "react-spinners";

export default function DashboardAdmin() {
  const [selectedItem, setSelectedItem] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleClick = (item: SetStateAction<number>) => {
    setSelectedItem(item);
  };

  function logoutHandler() {
    Cookie.remove("token");
    Cookie.remove("name");
    Cookie.remove("role");
    setLoading(false);
    Router.replace("/auth/login");
  }

  const name = Cookie.get("name");

  return (
    <>
      <Head>
        <title>Dashboard Admin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="text-white font-semibold ml-8 mt-5 mr-8">
        <div className="flex  items-center">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-sm btn-primary drawer-button lg:hidden mr-4"
          >
            Menu
          </label>
          <h1 className="hidden md:flex">Dashboard Admin</h1>

          <div className="flex-col ml-auto">
            {/* <div className="avatar">
              <div className="w-4 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                <img src="/favicon.ico" />
              </div>
            </div> */}
            {name ? (
              <h1 className="ml-auto">Welcome, {name}</h1>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
      <div className="drawer drawer-mobile">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          {selectedItem === 1 && <CrudDocument />}
          {selectedItem === 2 && <CrudAlat />}
        </div>

        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 bg-base-100 text-base-content">
            <li>
              <a onClick={() => handleClick(1)}>Dokumen</a>
            </li>
            <li>
              <a onClick={() => handleClick(2)}>Alat</a>
            </li>
            <li>
              <a
                className="btn btn-error text-black mt-5 py-3"
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
