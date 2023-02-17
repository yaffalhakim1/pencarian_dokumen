import AddDocument from "../../components/documents/tambah_button";
import Cookie from "js-cookie";
import axios, { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import DeleteButton from "../../components/documents/delete_button";
import EditButton from "../../components/documents/edit/[id]";
import LoadingTable from "../../components/loading_anim";
import { useAuthRedirect } from "../../hooks/useAuthRedirect";
import _ from "lodash";

export default function CrudDocument() {
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [data, setData] = useState<
    { uuid: any; name: string; device_id: any; photo: any; id: any }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const prevDataRef = useRef<
    { uuid: any; name: string; device_id: any; photo: any; id: any }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [lastPage, setLastPage] = useState<any>();
  const [firstPageUrl, setFirstPageUrl] = useState("");
  const [lastPageUrl, setLastPageUrl] = useState("");
  const [nextPageUrl, setNextPageUrl] = useState("");
  const [prevPageUrl, setPrevPageUrl] = useState("");
  useAuthRedirect();
  let index = 1;

  ///get data with pagination
  useEffect(() => {
    const url = "https://spda.17management.my.id/api/documents/data";
    const token = Cookie.get("token") as string;
    setLoading(true);

    axios
      .get(`${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const newData = res.data.data.data;
        if (!_.isEqual(newData, prevDataRef.current)) {
          setData(newData);
        }
        setCurrentPage(res.data.data.current_page);
        setLastPage(res.data.data.last_page);
        setFirstPageUrl(res.data.data.first_page_url);
        setPrevPageUrl(res.data.data.prev_page_url);
        setNextPageUrl(res.data.data.next_page_url);
        setLastPageUrl(res.data.data.last_page_url);
        setLoading(false);
      })
      .catch((err) => {
        const error = err as AxiosError;
        setLoading(false);
        setError(err.response?.data || error.message);
      });
    setLoading(false);
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
        const newData = res.data.data.data;
        setData(newData);
        setNextPageUrl(res.data.data.next_page_url);
        setPrevPageUrl(res.data.data.prev_page_url);
        setCurrentPage(res.data.data.current_page);
        setLastPage(res.data.data.last_page);
        setFirstPageUrl(res.data.data.first_page_url);
        setLastPageUrl(res.data.data.last_page_url);
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
    const url = "https://spda.17management.my.id/api/documents/delete";
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

  return (
    <>
      <div className="container px-6 py-12 h-full">
        <div className="flex flex-col h-full w-full  ">
          <AddDocument />
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex text-center justify-center items-center">
                <TailSpin color="#4B5563" height={40} width={40} />
                {/* <p className="ml-5 text-lg">Loading...</p> */}
              </div>
            ) : error ? (
              <div className="container mx-auto">
                <div className="flex text-center justify-center items-center">
                  {/* <p className="ml-5 text-lg">
                    An error occurred: {error}, silakan refresh halaman ini
                  </p> */}
                </div>
              </div>
            ) : (
              <table className="table table-normal lg:10/12 w-full">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name Dokumen</th>
                    <th>Device Id</th>
                    <th>Foto Dokumen</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item: any) => (
                    <tr key={item.id}>
                      <th>{index++}</th>
                      <td>{item.name}</td>
                      <td>{item.device_id}</td>

                      <td>
                        <img src={item.photo} alt="" width={100} />
                      </td>

                      <td>
                        <EditButton
                          id={item.id}
                          uuid={item.uuid}
                          name={item.name}
                          device_id={item.device_id}
                          photo={item.photo}
                        />
                        <br />
                        <DeleteButton
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
                      `https://spda.17management.my.id/api/documents/data?page=${page}`
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
