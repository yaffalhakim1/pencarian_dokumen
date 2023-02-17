import AddDocument from "../../components/documents/tambah_button";
import axios, { AxiosError } from "axios";
import Cookie from "js-cookie";
import { useEffect, useState } from "react";
import EditButton from "../../components/documents/edit/[id]";
import DeleteButton from "../../components/documents/delete_button";
import { TailSpin } from "react-loader-spinner";
import AddUser from "../../components/users/tambah_user";
import DeleteUser from "../../components/users/delete_user";
import EditUser from "../../components/users/edit/[id]";

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
      <div className="container px-6 py-6 h-full">
        <p className="text-2xl font-semibold mb-2">Dashboard User</p>
        <p className="text-md font-normal mb-8">
          Lakukan perubahan data user disini
        </p>
        <div className="flex justify-between">
          <AddUser />
          <div className="form-control">
            <div className="input-group input-group-sm ">
              <input
                type="text"
                placeholder="Search…"
                className="input input-bordered  input-sm w-full max-w-xs"
              />
              <button className="btn btn-square btn-sm">
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
        <div className="flex flex-col h-full w-full  ">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="container mx-auto">
                <div className="flex text-center justify-center items-center">
                  <TailSpin color="#4B5563" height={40} width={40} />
                  <p className="ml-5 text-lg">Loading...</p>
                </div>
              </div>
            ) : (
              <table className="table table-compact whitespace-normal lg:10/12 w-full">
                <thead>
                  <tr className="[&_th]:font-semibold [&_th]:capitalize ">
                    <th>No</th>
                    <th>Nama</th>
                    <th>Username </th>
                    <th>Email </th>
                    <th>Role</th>
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
                      <td>{item.role.join(", ")}</td>
                      {/* <td>
                        <img src={item.photo} alt="" width={100} />
                      </td> */}

                      <td>
                        <EditUser
                          uuid={item.uuid}
                          id={item.id}
                          name={item.name}
                          photo={item.photo}
                          device_id={item.device_id}
                        />
                        <br />
                        <DeleteUser
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
