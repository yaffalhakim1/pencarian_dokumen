import { useEffect, useState } from "react";
import Router from "next/router";
import Cookie from "js-cookie";
import { useAuthRedirect } from "../../hooks/useAuthRedirect";
import axios from "axios";
import Link from "next/link";
import DocumentsList from "../../components/documents/DocumentsList";
import Head from "next/head";
import useSWR from "swr";
import { TailSpin } from "react-loader-spinner";

interface Document {
  id: any;
  name: string;
  tag: string[];
  device_name: string;
  photo: string;
}

interface data {
  data: Document[];
}

interface ApiResponse {
  data: data;
  per_page: number;
  last_page: number;
}

export default function HomeUser() {
  useAuthRedirect();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
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

      setDocuments(response.data.data.data);
      setTotalPages(response.data.last_page);

      setHistory((prevHistory) => [...prevHistory, query]);
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Pencarian Dokumen</title>
      </Head>
      <div className="dropdown">
        <label
          tabIndex={0}
          className="btn  mask mask-squircle w-10 h-10 text-center bg-neutral-focus text-neutral-content"
        >
          <div className="w-10 rounded-full">{userName.charAt(0)}</div>
        </label>
        <ul
          tabIndex={0}
          className="mt-3 p-2 shadow dropdown-content bg-base-100 rounded-box w-52"
        >
          <li>{/* <a className="justify-between">Profile</a> */}</li>
          <li>{/* <a>Settings</a> */}</li>
          <li>
            <button
              className="btn btn-error capitalize w-full "
              onClick={logoutHandler}
            >
              logout
            </button>
          </li>
        </ul>
      </div>
      <div>
        <p className="text-xl text-center mt-6 font-semibold">
          Sistem Pencarian Dokumen Akreditasi
        </p>
      </div>

      <div className="flex justify-start w-full">
        <div className="form-control mt-4">
          <div className="input-group">
            <input
              className="input input-bordered"
              type="text"
              value={query}
              placeholder="Masukkan nama dokumen yang ingin anda cari"
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setShowHistory(true)} // Show the search history list when the search bar is clicked
              onBlur={() => setShowHistory(false)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
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
          <p className="text-zinc-600">coba: dokumen</p>
        </div>
      </div>
      <ul>
        {loading ? (
          <div className="text-center mt-8 text-slate-700 flex justify-center items-center">
            <TailSpin
              height="30"
              width="30"
              color="#000000"
              ariaLabel="tail-spin-loading"
              radius="1"
            />
            <p className="ml-4 text-lg font-medium">Sedang mencari...</p>
          </div>
        ) : (
          <>
            {documents.length > 0 ? (
              <ul className="mt-4">
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
                {documents.length == 0 ? (
                  <span className="text-lg font-medium">
                    Dokumen tidak ditemukan
                  </span>
                ) : (
                  <span className="text-lg font-medium">
                    Masukkan kata kunci untuk mencari dokumen
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </ul>
    </>
  );
}
