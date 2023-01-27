import AddDocument from "../../components/documents/tambah_button";
import EditButton from "../../components/documents/edit_button";
import DeleteButton from "../../components/documents/button_hapus";
import Cookie from "js-cookie";
import axios from "axios";
import React, { useState } from "react";

export default function CrudDocument(props: any) {
  const url = "https://spda-api.onrender.com/api/admin/documents";
  const token = Cookie.get("token") as string;
  //get data with axios
  const [data, setData] = React.useState([]);
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

  return (
    <>
      <div className="container px-6 py-12 h-full">
        <div className="flex flex-col h-full w-full  ">
          {/* <div className="md:w-full lg:w-10/12 lg:ml-20"> */}
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
                      <EditButton id={item.id} />
                      <DeleteButton id={item.id} />
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
