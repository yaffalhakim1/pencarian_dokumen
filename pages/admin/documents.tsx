import AddDocument from "../../components/documents/tambah_button";
import Cookie from "js-cookie";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import DeleteButton from "../../components/documents/delete_button";
import EditButton from "../../components/documents/edit/[id]";
import LoadingTable from "../../components/loading_anim";

export default function CrudDocument() {
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [data, setData] = useState<
    { uuid: any; name: string; device_id: any; photo: string }[]
  >([]);

  useEffect(() => {
    const url = "https://spdaapp.000webhostapp.com/api/documents/data";
    const token = Cookie.get("token") as string;
    // setLoading(true);
    // axios
    //   .get("https://spdaapp.000webhostapp.com/api/documents/data", {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //     withCredentials: true,
    //   })
    //   .then((res) => {
    //     setData(res.data.data);
    //     console.log(res.data.data, "data");
    //     setLoading(false);
    //   })
    //   .catch(function (error) {
    //     if (error.response) {
    //       console.log(error.response.data, "data");
    //       console.log(error.response.status, "status");
    //       console.log(error.response.headers, "headers");
    //     } else if (error.request) {
    //       console.log(error.request, "request");
    //     } else {
    //       console.log("Error", error.message, "error message");
    //     }

    //     console.log(error.config, "config");
    //   });
    // axios.getUri({
    //   url: "/documents/data",
    //   method: "get", // default
    //   baseURL: "https://spdaapp.000webhostapp.com/api",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    // });

    const fetchData = async () => {
      // setError(null);
      setLoading(true);
      try {
        const result = await fetch(
          "https://spdaapp.000webhostapp.com/api/documents/data",
          {
            method: "get",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          }
        );
        const json = await result.json();
        console.log(json, "json");
        setData(json);
      } catch (e) {
        console.log(e, "error");
      }
    };

    fetchData();

    setLoading(false);
  }, [data]);

  // edit

  // delete

  async function deleteDoc(id: any) {
    const token = Cookie.get("token") as string;
    const url = "https://spda-api.onrender.com/api/admin/documents";
    try {
      const res = await axios
        .delete(`${url}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          setShowSnackbar(true);

          setData((prevData) =>
            prevData.filter((item) => item.uuid !== id && data)
          );
        });
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.response?.data);
    }
  }

  return (
    <>
      <div className="container px-6 py-12 h-full">
        <div className="flex flex-col h-full w-full  ">
          <AddDocument />
          <div className="overflow-x-auto">
            {loading ? (
              <div className="container mx-auto">
                <div className="flex text-center justify-center items-center">
                  <TailSpin color="#4B5563" height={40} width={40} />
                  <p className="ml-5 text-lg">Loading...</p>
                </div>
              </div>
            ) : (
              <table className="table table-normal lg:10/12 w-full">
                <thead>
                  <tr>
                    <th></th>
                    <th>Nama Dokumen</th>
                    <th>Lokasi Dokumen</th>
                    <th>Foto Dokumen</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item: any) => (
                    <tr key={item.uuid}>
                      <th></th>
                      <td>{item.name}</td>
                      <td>{item.device_id}</td>
                      <td>
                        <img src={item.photo} alt="" width={100} />
                      </td>

                      <td>
                        {/* <EditButton
                          id={item.id}
                          name={item.name}
                          location={item.location}
                          photo={item.photo}
                        /> */}
                        <DeleteButton
                          onClick={() => {
                            deleteDoc(item.uuid);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
