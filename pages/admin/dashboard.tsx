import { SetStateAction, useState } from "react";
import Router from "next/router";
import Cookie from "js-cookie";
import CrudDocument from "./documents";
import CrudAlat from "./tools";

export default function DashboardAdmin() {
  const [selectedItem, setSelectedItem] = useState(1);

  const handleClick = (item: SetStateAction<number>) => {
    setSelectedItem(item);
  };

  function logoutHandler(e: { preventDefault: () => void }) {
    e.preventDefault();
    Cookie.remove("token");
    Router.replace("/auth/login");
  }

  return (
    <div>
      <div className="text-white font-semibold ml-8 mt-5">
        <div className="flex flex-row container items-center">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-sm btn-primary drawer-button lg:hidden mr-4"
          >
            Menu
          </label>
          <h1>Dashboard Admin</h1>
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
                className="btn btn-error text-black mt-5"
                onClick={logoutHandler}
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
