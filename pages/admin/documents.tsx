import AddDocument from "../../components/documents/tambah_button";
import EditButton from "../../components/documents/edit_button";
import Cookie from "js-cookie";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import DeleteButton from "../../components/documents/button_hapus";
import EditId from "../../components/documents/edit/[id]";
import SuccessInfo from "../../components/success_toast";

export default function CrudDocument() {
  const url = "https://spda-api.onrender.com/api/admin/documents";
  const token = Cookie.get("token") as string;
  const [data, setData] = React.useState<
    { id: string; name: string; location: string; photo: string }[]
  >([]);
  React.useEffect(() => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // delete

  const [showSnackbar, setShowSnackbar] = useState(false);
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
            prevData.filter((item) => item.id !== id && data)
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
                  <tr key={item.id}>
                    <th></th>
                    <td>{item.name}</td>
                    <td>{item.location}</td>
                    <td>
                      <img src={item.photo} alt="" width={100} />
                    </td>

                    <td>
                      <EditId
                        id={item.id}
                        name={item.name}
                        location={item.location}
                        photo={item.photo}
                      />
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
          </div>
        </div>
      </div>
    </>
  );
}
