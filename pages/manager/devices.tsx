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
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";

interface Item {
  id: number;
  name: string;
}

export default function CrudDevices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<any>([]);
  const [items, setItems] = useState<Item[]>([]);
  // useAuthRedirect();
  let index = 1;
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetcher = async (url: string) => {
    const token = Cookie.get("token") as string;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  };

  const { data, error, mutate } = useSWR(
    `https://spda.17management.my.id/api/devices/data?page=${page}`,
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
  const handleNextPage = () => {
    // Increment the page number and fetch the next page of data
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    // Decrement the page number and fetch the previous page of data
    setPage((prevPage) => prevPage - 1);
  };

  const pageNumbers = Array.from({ length: data.last_page }, (_, i) => i + 1);

  const handleDelete = async (id: any) => {
    const token = Cookie.get("token") as string;
    try {
      await axios.post(
        `https://spda.17management.my.id/api/devices/delete/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      mutate(data);
      toast.success("Alat berhasil dihapus");
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  function handleSearch() {
    const filteredItems = items.filter((item: { name: string }) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filteredItems);
  }

  return (
    <>
      <div className="container px-6  pt-2 pb-6 h-full">
        <p className="text-2xl font-semibold mb-2">Dashboard Alat</p>
        <p className="text-md font-normal mb-8">
          Lakukan perubahan data perangkat keras disini
        </p>
        <div className="md:flex md:justify-between">
          {/* <AddHardware onSuccess={mutate} /> */}
          {/* <div className="form-control">
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
          </div> */}
        </div>
        <div className="flex flex-col h-full w-full">
          <div className="overflow-x-auto">
            <table className="table table-compact lg:10/12 w-full whitespace-normal">
              <thead>
                <tr className="[&_th]:font-semibold [&_th]:capitalize">
                  <th>No</th>
                  <th>Lokasi</th>
                  <th>Meja</th>
                  <th>Ruang</th>
                  <th>Foto</th>
                  <th>Tag</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.data.data.map((item: any) => (
                  <tr key={item.id}>
                    <th>{index++}</th>
                    <td>{item.name}</td>
                    <td>{item.table}</td>
                    <td>{item.room}</td>
                    <td>
                      <img src={item.photo} width={100} alt="" />
                    </td>
                    <td>{item.tag.join(", ")}</td>
                    <td>
                      {/* <EditHardware
                        datas={{
                          id: item.id,
                          name: item.name,
                          tag: item.tag,
                          table: item.table,
                          room: item.room,
                          photo: item.photo,
                        }}
                        onSuccess={() => mutate()}
                      />
                      <DeleteHardware
                        id={item.id}
                        onSuccess={() => mutate()}
                        onClick={() => handleDelete(item.id)}
                      /> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex space-x-1 mt-5 mx-auto">
            {page >= 1 && (
              <button
                className="btn btn-primary btn-outline btn-sm capitalize"
                onClick={handlePrevPage}
              >
                Previous
              </button>
            )}
            <div className=" mx-auto items-center justify-center ">
              <div className="btn-group">
                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    disabled={pageNumber === page}
                    className={`btn btn-outline btn-primary btn-sm ${
                      pageNumber === page ? "btn-active" : ""
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleNextPage}
              className="btn btn-primary btn-outline btn-sm capitalize"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
