import React, { Fragment, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Cookie from "js-cookie";
import { Dialog, Transition } from "@headlessui/react";
import { TailSpin } from "react-loader-spinner";
import { GetServerSideProps } from "next";
import { toast } from "sonner";
import Select from "react-select";
import useSWR from "swr";

type Data = {
  name: string;
  code: any;
  room_id: any;
  id: any;
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
    "https://spda.17management.my.id/api/tables/data" + id,
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

export default function EditTable({ datas, onSuccess }: EditButtonProps) {
  const data = datas;
  const defaultValueRooms = {
    label: datas.room_name,
  };

  const [field, setField] = useState({
    name: data.name,
    code: data.code,
    room_id: data.room_id,
  });
  let [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  async function handleEditTable() {
    const id = datas.id;
    const token = Cookie.get("token") as string;
    const formData = new FormData();
    formData.append("name", field.name);
    formData.append("code", field.code);
    formData.append("room_id", field.room_id);

    const options = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const postFileReq = await axios.post(
        `https://spda.17management.my.id/api/tables/update/${id}`,
        formData,
        options
      );
      setLoading(false);
      onSuccess();
      closeModal();
      toast.success("Meja berhasil dirubah");
    } catch (error) {
      const err = error as AxiosError;
      toast.error("Meja gagal dirubah");
      closeModal();
      setLoading(false);
      console.log(err.response?.data);
    }
  }

  //get list room
  const token = Cookie.get("token") as string;
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
  const handleSelectRoomChange = (selectedRoom: any) => {
    const room_id = selectedRoom.value;
    setField((prevField) => ({
      ...prevField,
      room_id: room_id,
    }));
  };

  //   const handleSelectChange = (selectedOptions: any) => {
  //     const options = selectedOptions.map((option: any) => option.label);
  //     setField({
  //       ...field,
  //       tag: options,
  //     });
  //   };

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    setField({
      ...field,
      [e.target.name]: e.target.value,
    });
  };

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
                  Ubah Meja
                </Dialog.Title>
                <Dialog.Description className="mt-1 mb-4 text-md">
                  Masukkan nama meja yang ingin anda ubah disini.
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Nama Meja</span>
                    <input
                      type="text"
                      placeholder={data.name}
                      className="input input-bordered"
                      name="name"
                      onChange={handleChange}
                    />
                  </label>
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Kode Meja</span>
                    <input
                      type="text"
                      placeholder={data.code}
                      className="input input-bordered"
                      name="code"
                      onChange={handleChange}
                    />
                  </label>
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Ruang</span>
                    <Select
                      options={rooms}
                      className="basic-single"
                      defaultValue={defaultValueRooms}
                      classNamePrefix="select"
                      onChange={handleSelectRoomChange}
                      name="room_id"
                    />
                  </label>
                </Dialog.Description>
                <button
                  onClick={() => {
                    setLoading(true);
                    handleEditTable();
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
                </button>{" "}
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
