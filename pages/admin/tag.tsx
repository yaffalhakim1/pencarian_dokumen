import AddDocument from "../../components/documents/AddDocs";
import Cookie from "js-cookie";
import axios, { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import DeleteButton from "../../components/documents/DeleteDocs";
import EditButton from "../../components/documents/edit/[id]";
import LoadingTable from "../../components/SkeletonTable";
import { useAuthRedirect } from "../../hooks/useAuthRedirect";
import _ from "lodash";
import DeleteHardware from "../../components/hardware/DeleteHardware";
import AddHardware from "../../components/hardware/AddHardware";
import EditHardware from "../../components/hardware/edit/[id]";
import EditTags from "../../components/tags/edit/[id]";
import DeleteTags from "../../components/tags/DeleteTags";

interface Item {
  id: number;
  name: string;
}

export default function CrudTags() {
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [data, setData] = useState<{ name: string; id: any }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const prevDataRef = useRef<{ name: string; id: any }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [lastPage, setLastPage] = useState<any>();
  const [firstPageUrl, setFirstPageUrl] = useState("");
  const [lastPageUrl, setLastPageUrl] = useState("");
  const [nextPageUrl, setNextPageUrl] = useState("");
  const [prevPageUrl, setPrevPageUrl] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<any>([]);
  const [items, setItems] = useState<Item[]>([]);
  useAuthRedirect();
  let index = 1;

  ///get data with pagination
  useEffect(() => {
    const url = "https://spda.17management.my.id/api/tags/data";
    const token = Cookie.get("token") as string;
    setLoading(true);
    axios
      .get(`${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const newData = res.data.data;

        if (!_.isEqual(newData, prevDataRef.current)) {
          setData(newData);
        }
        setCurrentPage(res.data.current_page);
        setLastPage(res.data.data.last_page);
        setFirstPageUrl(res.data.first_page_url);
        setPrevPageUrl(res.data.prev_page_url);
        setNextPageUrl(res.data.next_page_url);
        setLastPageUrl(res.data.last_page_url);
        setLoading(false);
      })
      .catch((err) => {
        const error = err as AxiosError;
        setLoading(false);
        setError(err.response?.data || error.message);
      });
    // setLoading(false);
    prevDataRef.current = data;
  }, [prevDataRef]);

  function handlePageClick(url: string) {
    setLoading(true);
    axios
      .get(`${url}`, {
        headers: {
          Authorization: `Bearer ${Cookie.get("token") as string}`,
        },
      })
      .then((res) => {
        const newData = res.data.data;
        setData(newData);
        setNextPageUrl(res.data.next_page_url);
        setPrevPageUrl(res.data.prev_page_url);
        setCurrentPage(res.data.current_page);
        setLastPage(res.data.last_page);
        setFirstPageUrl(res.data.first_page_url);
        setLastPageUrl(res.data.last_page_url);
        setLoading(false);
      })
      .catch((err) => {
        const error = err as AxiosError;
        setLoading(false);
        setError(err.response?.data || error.message);
      });
  }

  async function deleteDoc(id: any) {
    const token = Cookie.get("token") as string;
    const url = "https://spda.17management.my.id/api/tags/delete";
    try {
      const res = await axios
        .post(
          url + `/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setData((prevData) =>
            prevData.filter((item) => item.id !== id && data)
          );
        });
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.message);
      console.log(err.response?.data, err.response?.status, "error delete");
    }
  }

  function handleSearch() {
    const filteredItems = items.filter((item: { name: string }) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filteredItems);
  }

  return (
    <>
      <div className="container px-6  pt-2 pb-6 h-full">
        <p className="text-2xl font-semibold mb-2">Dashboard Tag</p>
        <p className="text-md font-normal mb-8">
          Lakukan perubahan data tag atau penanda disini
        </p>
        <div className="md:flex md:justify-between">
          <AddHardware />
          <div className="form-control">
            <div className="input-group input-group-sm mb-3">
              <input
                type="text"
                placeholder="Search…"
                className="input input-bordered  input-sm w-full max-w-xs"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <button onClick={handleSearch} className="btn btn-square btn-sm">
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
        </div>
        <div className="flex flex-col h-full w-full">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="mx-auto container">
                <div className="flex mx-auto text-center justify-center items-center">
                  <TailSpin color="#4B5563" height={40} width={40} />
                  <p className="ml-5 text-lg text-black">Loading...</p>
                </div>
              </div>
            ) : error ? (
              <div className="container mx-auto">
                <div className="flex text-center justify-center items-center">
                  <p className="ml-5 text-lg">
                    silakan refresh halaman ini atau login kembali
                  </p>
                </div>
              </div>
            ) : (
              <table className="table table-compact lg:10/12 w-full whitespace-normal">
                <thead>
                  <tr className="[&_th]:font-semibold [&_th]:capitalize">
                    <th>No</th>
                    <th>Name Tag</th>

                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item: any) => (
                    <tr key={item.id}>
                      <th>{index++}</th>
                      <td>{item.name}</td>
                      <td>{item.id}</td>

                      <td>
                        <EditTags id={item.id} name={item.name} />
                        {/* <br /> */}
                        <DeleteTags
                          onClick={() => {
                            deleteDoc(item.id);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="container flex mx-auto items-center justify-center mt-5">
            <div className="btn-group">
              {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => (
                <button
                  className={`btn btn-primary ${
                    currentPage === page ? "active" : ""
                  }`}
                  onClick={() =>
                    handlePageClick(
                      `https://spda.17management.my.id/api/tags/data?page=${page}`
                    )
                  }
                  key={page}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
