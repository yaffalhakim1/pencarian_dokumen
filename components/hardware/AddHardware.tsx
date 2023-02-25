import axios, { AxiosError } from "axios";
import { useState, Fragment } from "react";
import Cookie from "js-cookie";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { TailSpin } from "react-loader-spinner";
import Alert from "../Alert";
import { toast } from "sonner";

export default function AddHardware({ onSuccess }: { onSuccess: () => void }) {
  const [field, setField] = useState({
    name: "",
    table: "",
    room: "",
    photo: "",
  });
  let [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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

  async function handleFileUpload() {
    const input = document.querySelector(
      "input[type='file']"
    ) as HTMLInputElement;
    const formData = new FormData();
    formData.append("name", field.name);
    formData.append("table", field.table);
    formData.append("room", field.room);
    formData.append("photo", input.files![0]);
    // formData.append("tag_id", field.tag_id);
    // formData.append("uuid", field.uuid);

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
        .then((res) => {
          console.log(res.data, "res");
        });

      onSuccess();
      setLoading(false);
      closeModal();
      toast.success("Alat berhasil ditambahkan");
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.response?.data, "error upload");
      toast.error("Gagal menambahkan alat");
    }
  }

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

                    {/* supposed to be a dropdown with name and id from api */}
                    {/* https://react-select.com/home, pakai yang multi select kedua */}
                    <input
                      type="text"
                      placeholder="Node 1"
                      className="input input-bordered"
                      name="name"
                      onChange={handleChange}
                    />
                  </label>
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Meja</span>
                    <input
                      type="text"
                      placeholder="Meja Bu Dania"
                      className="input input-bordered"
                      name="table"
                      onChange={handleChange}
                    />
                  </label>
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Ruang</span>
                    <input
                      type="text"
                      placeholder="Ruangan Dosen 2"
                      className="input input-bordered"
                      name="room"
                      onChange={handleChange}
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
                    handleFileUpload();
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
                      {/* <button className="btn btn-success btn-sm">
                        Menambahkan dokumen...
                      </button> */}
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
