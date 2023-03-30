import React, { Fragment, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Cookie from "js-cookie";
import { Dialog, Transition } from "@headlessui/react";
import { TailSpin } from "react-loader-spinner";
import { GetServerSideProps } from "next";
import Select from "react-select";
import { toast } from "sonner";
import useSWR from "swr";

type Data = {
  name: string;
  tag: any;
  table?: any;
  room?: any;
  photo: any;
  id: any;
  code: any;
  table_id: any;
  room_id: any;
  table_name: any;
  room_name: any;
};

interface EditButtonProps {
  datas: Data;
  onSuccess: () => void;
}

export const getServerSideProps: GetServerSideProps<{ data: Data }> = async (
  context
) => {
  const id = context.query.id as string;
  const token = context.req.headers.token;
  const response = await axios.get(
    "https://spda.17management.my.id/api/devices/data/" + id,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return {
    props: {
      token: token,
      data: response.data,
    },
  };
};

export default function EditHardware({ datas, onSuccess }: EditButtonProps) {
  const data = datas;
  const defaultValueTags = data.tag.map((tag: any) => ({
    label: tag,
  }));
  const defaultValueTables = {
    label: data.table_name,
  };
  const defaultValueRooms = {
    label: data.room_name,
  };

  const [field, setField] = useState({
    name: data.name,
    table: data.table,
    room: data.room,
    photo: data.photo,
    tag: data.tag,
    id: data.id,
    code: data.code,
    table_id: data.table_id,
    room_id: data.room_id,
    table_name: data.table_name,
    room_name: data.room_name,
  });
  let [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [options, setOptions] = useState<any>([]);
  // const [tables, setTables] = useState<any>([]);
  // const [rooms, setRooms] = useState<any>([]);
  const [selectedValue, setSelectedValue] = useState<any>([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  async function handleEditDevice() {
    const id = datas.id;
    const token = Cookie.get("token") as string;
    const input = document.querySelector(
      "input[type='file']"
    ) as HTMLInputElement;
    const formData = new FormData();
    for (let i = 0; i < field.tag.length; i++) {
      formData.append("tag[]", field.tag[i]);
    }
    formData.append("name", field.name);
    formData.append("table_id", field.table_id);
    formData.append("room_id", field.room_id);
    if (field.photo instanceof File) {
      formData.append("photo", field.photo);
    }
    formData.append("code", field.code);

    const options = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const postFileReq = await axios.post(
        `https://spda.17management.my.id/api/devices/update/${id}`,
        formData,
        options
      );
      setLoading(false);
      onSuccess();
      closeModal();
      toast.success("Detail alat berhasil diubah");
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.response?.data);
      toast.error("Detail alat gagal diubah");
      setLoading(false);
      closeModal();
    }
  }

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setField({
        ...field,
        photo: files[0] || field.photo,
      });
    } else {
      setField({
        ...field,
        [name]: value,
      });
    }
  };

  const handleSelectChange = (selectedOptions: any) => {
    const options = selectedOptions.map((option: any) => option.label);
    setField({
      ...field,
      tag: options,
    });
  };

  const handleSelectRoomChange = (selectedRoom: any) => {
    const room_id = selectedRoom.value;
    setField((prevField) => ({
      ...prevField,
      room_id: room_id,
    }));
  };

  const handleSelectTableChange = (selectedTable: any) => {
    const table_id = selectedTable.value;
    setField((prevField) => ({
      ...prevField,
      table_id: table_id,
    }));
  };

  const token = Cookie.get("token") as string;

  const { data: tables, error: tablesError } = useSWR(
    "https://spda.17management.my.id/api/tables/list",
    (url) =>
      axios
        .get(url, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) =>
          res.data.data.map((item: { id: any; name: any }) => ({
            value: item.id,
            label: item.name,
          }))
        )
  );

  const { data: rooms, error: roomsError } = useSWR(
    "https://spda.17management.my.id/api/rooms/list",
    (url) =>
      axios
        .get(url, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) =>
          res.data.data.map((item: { id: any; name: any }) => ({
            value: item.id,
            label: item.name,
          }))
        )
  );

  const { data: tags, error: tagsError } = useSWR(
    "https://spda.17management.my.id/api/tags/list",
    (url) =>
      axios
        .get(url, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) =>
          res.data.data.map((item: { id: any; name: any }) => ({
            value: item.id,
            label: item.name,
          }))
        )
  );

  // useEffect(() => {
  //   const getTags = async () => {
  //     try {
  //       const token = Cookie.get("token") as string;
  //       const res = await axios
  //         .get("https://spda.17management.my.id/api/tags/list", {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         })
  //         .then((res) => {
  //           const options = res.data.data.map((item: any) => {
  //             return {
  //               value: item.id,
  //               label: item.name,
  //             };
  //           });

  //           setOptions(options);
  //           if (options.length > 0) {
  //             setSelectedValue(options[0]);
  //           }
  //         });
  //     } catch (error) {
  //       const err = error as AxiosError;
  //       console.log(err.response?.data, "error get tags in edit hardware");
  //     }
  //   };
  //   getTags();
  // }, []);

  // useEffect(() => {
  //   const getTableId = async () => {
  //     try {
  //       const token = Cookie.get("token") as string;
  //       const res = await axios
  //         .get("https://spda.17management.my.id/api/tables/list", {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         })
  //         .then((res) => {
  //           const tables = res.data.data.map((item: any) => {
  //             return {
  //               value: item.id,
  //               label: item.name,
  //             };
  //           });
  //           setTables(tables);
  //           if (tables.length > 0) {
  //             setSelectedTable(tables);
  //           }
  //         });
  //     } catch (error) {
  //       const err = error as AxiosError;
  //       console.log(err.response?.data, "error get table");
  //     }
  //   };
  //   getTableId();
  // }, []);

  // useEffect(() => {
  //   const getRoomId = async () => {
  //     try {
  //       const token = Cookie.get("token") as string;
  //       const res = await axios
  //         .get("https://spda.17management.my.id/api/rooms/list", {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         })
  //         .then((res) => {
  //           const rooms = res.data.data.map((item: any) => {
  //             return {
  //               value: item.id,
  //               label: item.name,
  //             };
  //           });
  //           setRooms(rooms);
  //           if (rooms.length > 0) {
  //             setSelectedRoom(rooms);
  //           }
  //         });
  //     } catch (error) {
  //       const err = error as AxiosError;
  //       console.log(err.response?.data, "error get rooms");
  //     }
  //   };
  //   getRoomId();
  // }, []);

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="btn btn-sm btn-warning mb-3 ml-auto capitalize text-white mr-3"
      >
        Edit
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" onClose={() => closeModal()} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="modal-box m-5">
                <Dialog.Title className="font-bold text-xl">
                  Ubah Alat
                </Dialog.Title>
                <Dialog.Description className="mt-1 mb-4 text-md">
                  Masukkan nama, id alat yang ingin anda ubah disini.
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Nama Ruangan</span>
                    <input
                      type="text"
                      placeholder={data.name}
                      className="input input-bordered"
                      name="name"
                      onChange={handleChange}
                    />
                  </label>
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Tag</span>
                    <Select
                      name="tag[]"
                      isMulti
                      options={tags}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={handleSelectChange}
                      defaultValue={defaultValueTags}
                    />
                  </label>
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Meja</span>
                    <Select
                      name="table_id"
                      options={tables}
                      className="basic-single"
                      classNamePrefix="select"
                      defaultValue={defaultValueTables}
                      onChange={handleSelectTableChange}
                    />
                  </label>
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Ruang</span>
                    <Select
                      name="room_id"
                      options={rooms}
                      className="basic-single"
                      classNamePrefix="select"
                      defaultValue={defaultValueRooms}
                      onChange={handleSelectRoomChange}
                    />
                  </label>
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Kode</span>
                    <input
                      type="text"
                      placeholder={data.code}
                      className="input input-bordered"
                      name="code"
                      onChange={handleChange}
                    />
                  </label>
                  <label className="label">
                    <span className="label-text">foto ruangan lokasi</span>
                  </label>
                  <img src={data.photo} alt="Existing Image" width={300} />
                  <input
                    type="file"
                    className="file-input w-full max-w-xs mt-2"
                    name="photo"
                    placeholder={data.photo}
                    onChange={handleChange}
                  />
                </Dialog.Description>
                <button
                  onClick={() => {
                    setLoading(true);
                    handleEditDevice();
                  }}
                  className="btn btn-accent mr-3 mb-3 md:mb-0 capitalize"
                >
                  {loading ? (
                    <div className="flex flex-wrap">
                      <TailSpin
                        height="20"
                        width="20"
                        color="#ffffff"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                      />
                    </div>
                  ) : (
                    "Simpan"
                  )}
                </button>
                <button onClick={closeModal} className="btn capitalize">
                  Batal
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
