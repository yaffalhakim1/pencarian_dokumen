import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import Router from "next/router";
import Cookie from "js-cookie";
import { useAuthRedirect } from "../../hooks/useAuthRedirect";
import axios from "axios";
import Link from "next/link";
import DocumentsList from "../../components/documents/DocumentsList";
import Head from "next/head";

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
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  // const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState(() => {
    const searchHistoryString = localStorage.getItem("searchHistory");
    if (searchHistoryString) {
      return JSON.parse(searchHistoryString);
    }
    return [];
  });

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
      setDocuments(response.data.data.data);
      setTotalPages(response.data.last_page);
      console.log(response.data.data);
      const newSearchHistory = [...searchHistory, query];
      setSearchHistory(newSearchHistory);
      localStorage.setItem("searchHistory", JSON.stringify(newSearchHistory));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const searchHistoryString = localStorage.getItem("searchHistory");
    if (searchHistoryString) {
      setSearchHistory(JSON.parse(searchHistoryString));
    }
  }, []);

  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const newQuery = event.target.value;
  //   const newSearchHistory = [...searchHistory];
  //   if (newQuery.length > 0 && !newSearchHistory.includes(newQuery)) {
  //     newSearchHistory.unshift(newQuery);
  //     localStorage.setItem(
  //       "searchHistory",
  //       JSON.stringify(newSearchHistory.slice(0, 5))
  //     );
  //   }
  //   setQuery(newQuery);
  //   setSearchHistory(newSearchHistory);
  // };

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
          <div className="input-group ">
            <input
              className="input input-bordered"
              type="text"
              value={query}
              placeholder="Masukkan nama dokumen yang ingin anda cari"
              onChange={(event) => setQuery(event.target.value)}
              // onChange={handleInputChange}
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
        {/* <ul>
          {searchHistory.map(
            (
              searchQuery:
                | string
                | number
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | ReactFragment
                | ReactPortal
                | null
                | undefined,
              index: Key | null | undefined
            ) => (
              <li key={index}>{searchQuery}</li>
            )
          )}
        </ul> */}
      </div>

      <ul>
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
            {query ? (
              <span>Dokumen tidak ditemukan</span>
            ) : (
              <span>Masukkan kata kunci untuk mencari dokumen</span>
            )}
          </div>
        )}
      </ul>
    </>
  );
}
