import axios, { AxiosError } from "axios";
import { useState, Fragment, useEffect } from "react";
import Cookie from "js-cookie";
import { Dialog, Transition } from "@headlessui/react";
import { TailSpin } from "react-loader-spinner";
import { toast } from "sonner";
import Select from "react-select";
import useSWR from "swr";

export default function AddHardware({ onSuccess }: { onSuccess: () => void }) {
  const [field, setField] = useState({
    name: "",
    photo: "",
    tag: [],
    code: "" as any,
    table_id: [] as any,
    room_id: [] as any,
  });
  let [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>([]);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    setField({
      ...field,
      [e.target.name]: e.target.value,
      photo: name === "photo" ? files[0] : field.photo,
    });
  };

  const token = Cookie.get("token") as string;

  const { data: tables, error: tablesError } = useSWR(
    selectedRoom
      ? `https://spda.17management.my.id/api/tables/list?room_id=${selectedRoom.value}`
      : null,
    (url: string) =>
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

  async function handleAddDevice() {
    const formData = new FormData();
    formData.append("name", field.name);
    formData.append("table_id", field.table_id);
    formData.append("room_id", field.room_id);
    const input = document.querySelector(
      "input[type='file']"
    ) as HTMLInputElement;
    formData.append("photo", input.files![0]);
    formData.append("code", field.code);
    for (let i = 0; i < field.tag.length; i++) {
      formData.append("tag[]", field.tag[i]);
    }

    try {
      const token = Cookie.get("token") as string;
      const postFileReq = await axios
        .post("https://spda.17management.my.id/api/devices/data", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "*/*",
            authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {});

      onSuccess();
      setLoading(false);
      closeModal();
      toast.success("Alat berhasil ditambahkan");
    } catch (error: any) {
      if (error.response.status === 500) {
        toast.error("Register gagal, silakan coba lagi");
      } else if (
        error.response.data &&
        error.response.data.message &&
        typeof error.response.data.message === "object"
      ) {
        const errors = error.response.data.message;
        for (const field in errors) {
          errors[field].forEach((error: string) => {
            toast.error(error);
          });
        }
      } else {
        toast.error("Register gagal, silakan coba lagi");
      }
      setLoading(false);
      closeModal();
    }
  }

  const handleSelectChange = (selectedOptions: any) => {
    const options = selectedOptions.map((option: any) => option.label);
    setField({
      ...field,
      tag: options,
    });
  };

  // const handleSelectRoomChange = (selectedRoom: any) => {
  //   const room_id = selectedRoom.value;
  //   setField((prevField) => ({
  //     ...prevField,
  //     room_id: room_id,
  //   }));
  // };

  const handleSelectRoomChange = (selectedRoom: any) => {
    setSelectedRoom(selectedRoom);
    setField((prevField) => ({
      ...prevField,
      room_id: selectedRoom.value,
      table_id: null, // reset table_id when room changes
    }));
  };

  const handleSelectTableChange = (selectedTable: any) => {
    const table_id = selectedTable.value;
    setField((prevField) => ({
      ...prevField,
      table_id: table_id,
    }));
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="btn btn-sm btn-accent mb-3 mr-auto capitalize text-white"
      >
        Tambah Alat
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
                  Tambah Alat
                </Dialog.Title>
                <Dialog.Description className="mt-1 mb-4 text-md">
                  Masukkan nama ruangan dan id alat yang ingin anda tambahkan
                  disini.
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Nama</span>
                    <input
                      type="text"
                      placeholder="Node 1"
                      className="input input-bordered"
                      name="name"
                      onChange={handleChange}
                    />
                  </label>
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Kode</span>
                    <input
                      type="text"
                      placeholder="Node 1"
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
                  {selectedRoom && (
                    <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                      <span>Meja</span>
                      <Select
                        options={tables || []}
                        className="basic-single"
                        classNamePrefix="select"
                        onChange={handleSelectTableChange}
                        name="table_id"
                      />
                    </label>
                  )}
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Tag</span>
                    <Select
                      isMulti
                      options={tags}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={handleSelectChange}
                      name="tag"
                    />
                  </label>
                  <label className="label">
                    <span className="label-text">
                      Masukkan foto ruangan lokasi
                    </span>
                  </label>
                  <input
                    type="file"
                    placeholder={field.photo}
                    className="file-input w-full max-w-xs"
                    name="photo"
                    onChange={handleChange}
                  />
                </Dialog.Description>
                <button
                  onClick={() => {
                    handleAddDevice();
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
