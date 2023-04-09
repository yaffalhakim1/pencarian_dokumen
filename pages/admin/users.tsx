import AddDocument from "../../components/documents/AddDocs";
import axios, { AxiosError } from "axios";
import Cookie from "js-cookie";
import { useEffect, useRef, useState } from "react";
import EditButton from "../../components/documents/edit/[id]";
import DeleteButton from "../../components/documents/DeleteDocs";
import { TailSpin } from "react-loader-spinner";
import AddUser from "../../components/users/tambah_user";
import DeleteUser from "../../components/users/DeleteUser";
import EditUser from "../../components/users/edit/[id]";
import _ from "lodash";
import LoadingTable from "../../components/SkeletonTable";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";

export default function CrudUsers() {
  let index = 1;

  const fetcher = async (url: string) => {
    const token = Cookie.get("token") as string;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  };

  const { data, error, mutate } = useSWR(
    "https://spda.17management.my.id/api/users/data",
    fetcher
  );
  if (error)
    return (
      <div className="container mx-auto">
        <div className="flex text-center justify-center items-center">
          <p className="ml-5 text-lg">
            silakan refresh halaman ini atau login kembali
          </p>
        </div>
      </div>
    );
  if (!data)
    return (
      <div className="mx-auto container">
        <div className="flex mx-auto text-center justify-center items-center">
          <TailSpin color="#4B5563" height={40} width={40} />
          <p className="ml-5 text-lg text-black">Loading...</p>
        </div>
      </div>
    );

  const handleDelete = async (id: any) => {
    const token = Cookie.get("token") as string;
    try {
      await axios.post(
        `https://spda.17management.my.id/api/users/delete/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      mutate(data);
      toast.success("Pengguna berhasil dihapus");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="container px-6 pt-2 pb-6 h-full">
        <p className="text-2xl font-semibold mb-2">Dashboard User</p>
        <p className="text-md font-normal mb-4">
          Lakukan perubahan data user disini
        </p>
        <div className="md:flex md:justify-between ">
          <AddUser onSuccess={mutate} />
          {/* <div className="form-control">
            <div className="input-group input-group-sm mb-3">
              <input
                type="text"
                placeholder="Search…"
                className="input input-bordered input-sm w-full max-w-xs"
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
          </div> */}
        </div>
        <div className="flex flex-col h-full w-full">
          <div className="overflow-x-auto">
            <table className="table table-compact whitespace-normal lg:10/12 w-full">
              <thead>
                <tr className="[&_th]:font-semibold [&_th]:capitalize">
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
                    <td>
                      {item.role
                        .filter((role: string) => role !== "Super Admin")
                        .join(", ")}
                    </td>
                    {/* <td>
                        <img src={item.photo} alt="" width={100} />
                      </td> */}
                    <td>
                      <EditUser
                        datas={{
                          role: item.role,
                          name: item.name,
                          username: item.username,
                          email: item.email,
                          id: item.id,
                        }}
                        onSuccess={() => mutate()}
                        // device_id={item.device_id}
                      />
                      {/* <br /> */}
                      <DeleteUser
                        id={item.id}
                        onSuccess={() => mutate()}
                        onClick={() => handleDelete(item.id)}
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
