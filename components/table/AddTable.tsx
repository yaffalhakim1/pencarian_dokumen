import React from "react";
import { useState, Fragment, useEffect } from "react";
import Cookie from "js-cookie";
import { Dialog, Transition } from "@headlessui/react";
import { TailSpin } from "react-loader-spinner";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import Select from "react-select";
import useSWR from "swr";

export default function AddRoom({ onSuccess }: { onSuccess: () => void }) {
  const [field, setField] = useState({
    name: "",
    code: "" as any,
    room_id: "" as any,
  });
  let [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<any>([]);
  const [selectedValue, setSelectedValue] = useState(null);
  // const [rooms, setRooms] = useState<any>([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setField(() => {
      const updatedField = {
        ...field,
        [name]: value,
      };
      return updatedField;
    });
  };

  const handleSelectRoomChange = (selectedRoom: any) => {
    const room_id = selectedRoom.value;
    setField((prevField) => ({
      ...prevField,
      room_id: room_id,
    }));
  };

  const handleSelectChange = (selectedOptions: any) => {
    const options = selectedOptions.map((option: any) => option.label);
    setField({
      ...field,
      room_id: options,
    });
  };

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

  async function handleAddTable() {
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
    axios
      .post(
        "https://spda.17management.my.id/api/tables/data",
        formData,
        options
      )
      .then((postFileReq) => {
        onSuccess();
        setLoading(false);
        closeModal();
        toast.success("Meja berhasil ditambahkan");
      })
      .catch((error) => {
        const err = error as AxiosError;
        if (err.response?.status === 400) {
          toast.error("Meja sudah ada");
        } else {
          toast.error("Gagal menambahkan meja");
        }

        setLoading(false);
        closeModal();
        console.log(err.response?.data, "error upload");
      });
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="btn btn-sm btn-accent mb-3 mr-auto capitalize text-white "
      >
        Tambah Meja
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
                  Tambah Meja
                </Dialog.Title>
                <Dialog.Description className="mt-1 mb-4 text-md">
                  Masukkan nama dan kode meja yang ingin anda tambahkan disini.
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Nama Meja</span>
                    <input
                      type="text"
                      placeholder="nama meja"
                      className="input input-bordered"
                      name="name"
                      onChange={handleChange}
                    />
                  </label>
                  {/* https://react-select.com/home, pakai yang single */}
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Kode Meja</span>
                    <input
                      type="text"
                      placeholder="A.201.D"
                      //   value={deviceId}
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
                      classNamePrefix="select"
                      onChange={handleSelectRoomChange}
                      name="room_id"
                    />
                  </label>
                </Dialog.Description>
                <button
                  onClick={() => {
                    handleAddTable();
                    setLoading(true);
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
