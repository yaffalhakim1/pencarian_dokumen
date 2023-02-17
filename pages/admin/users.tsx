import AddDocument from "../../components/documents/tambah_button";
import axios, { AxiosError } from "axios";
import Cookie from "js-cookie";
import { useEffect, useState } from "react";
import EditButton from "../../components/documents/edit/[id]";
import DeleteButton from "../../components/documents/delete_button";
import { TailSpin } from "react-loader-spinner";

export default function CrudAlat() {
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [data, setData] = useState<
    { id: string; name: string; location: string; photo: string }[]
  >([]);
  let index = 1;

  useEffect(() => {
    const url = "https://spda.17management.my.id/api/users/data";
    const token = Cookie.get("token") as string;

    setLoading(true);
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setData(res.data.data);
        console.log(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

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
                    <th>No</th>
                    <th>Nama</th>
                    <th>Username </th>
                    <th>Email </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item: any) => (
                    <tr key={item.id}>
                      <th>{index++}</th>
                      <td>{item.name}</td>
                      <td>{item.username}</td>
                      <td>{item.email}</td>
                      {/* <td>
                        <img src={item.photo} alt="" width={100} />
                      </td> */}

                      <td>
                        <EditButton
                          uuid={item.uuid}
                          id={item.id}
                          name={item.name}
                          photo={item.photo}
                          device_id={item.device_id}
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
            )}
          </div>
        </div>
      </div>
    </>
  );
}
