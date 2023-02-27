import { useEffect, useState } from "react";
import Router from "next/router";
import Cookie from "js-cookie";
import { useAuthRedirect } from "../../hooks/useAuthRedirect";
import axios from "axios";
import Link from "next/link";
import DocumentsList from "../../components/documents/DocumentsList";

interface Document {
  // Define the shape of a document object based on the API response
  // For example:
  id: any;
  name: string;
  tag: string[];
  device_name: string;
  photo: string;
  // Add more properties as needed
}

interface ApiResponse {
  // Define the shape of the API response
  // For example:
  data: Document[];
  per_page: number;
  last_page: number;
  // Add more properties as needed
}

export default function HomeUser() {
  useAuthRedirect();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

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

  const handleSearch = async () => {
    const token = Cookie.get("token") as string;
    try {
      const response = await axios.get<ApiResponse>(
        `https://spda.17management.my.id/api/documents/data`,
        {
          params: {
            query,
            pageSize: 10,
            page: currentPage,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDocuments(response.data.data);
      setTotalPages(response.data.last_page);
      // console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // if you want to use pagination, you can uncomment use the code below

  // const handlePrevPage = () => {
  //   setCurrentPage(currentPage - 1);
  // };

  // const handleNextPage = () => {
  //   setCurrentPage(currentPage + 1);
  // };

  return (
    <>
      <div className="">
        <p className="text-xl text-center mt-6 font-semibold">
          Sistem Pencarian Dokumen Akreditasi
        </p>
      </div>
      <div className="flex justify-between mt-4">
        <div className="form-control">
          <div className="input-group">
            <input
              className="input input-bordered"
              type="text"
              value={query}
              placeholder="Masukkan nama dokumen yang ingin anda cari"
              onChange={(event) => setQuery(event.target.value)}
            />
            <button onClick={handleSearch} className="btn btn-square">
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
      <ul>
        {documents.length > 0 ? (
          <ul>
            {documents.map((document) => (
              <DocumentsList
                key={document.id}
                id={document.id}
                name={document.name}
                tag={document.tag}
                device_name={document.device_name}
                photo={document.photo}
              />
            ))}
          </ul>
        ) : (
          <div className="text-center mt-8 text-slate-700">
            Dokumen tidak ditemukan
          </div>
        )}
      </ul>
      {/* 

      if you want to use pagination, uncomment this code below
      
      */}
      {/* <div>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div> */}
    </>
  );
}
