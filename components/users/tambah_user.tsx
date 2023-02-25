import axios, { AxiosError } from "axios";
import { useState, Fragment } from "react";
import Cookie from "js-cookie";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { TailSpin } from "react-loader-spinner";
import Alert from "../Alert";

export default function AddUser(this: any) {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [field, setField] = useState({
    name: "",
    device_id: "",
    photo: "",
    uuid: "",
  });
  const [photoUrl, setPhotoUrl] = useState("");
  let [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
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
    formData.append("photo", input.files![0]);
    formData.append("name", field.name);
    formData.append("device_id", field.device_id);
    formData.append("uuid", field.uuid);

    try {
      const token = Cookie.get("token") as string;
      const postFileReq = await axios.post(
        "https://spda.17management.my.id/api/documents/data",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "*/*",
            authorization: `Bearer ${token}`,
          },
        }
      );

      const postFileRes = await postFileReq.data;
      setLoading(false);
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.response?.data, "error upload");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="btn btn-sm btn-success mb-3 mr-auto no-animation capitalize"
      >
        Tambah User
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
            {/* {showSnackbar && (
              <Alert
                message="Dokumen berhasil ditambahkan"
                errorType="success"
              />
            )} */}

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
                <Dialog.Title className="font-bold text-lg">
                  Tambah User
                </Dialog.Title>
                <Dialog.Description className="py-4">
                  Masukkan nama, lokasi, dan foto dokumen yang ingin anda
                  tambahkan disini
                  <label className="input-group mb-5 mt-5">
                    <span>Nama Dokumen</span>
                    <input
                      type="text"
                      placeholder="nama dokumen"
                      className="input input-bordered"
                      name="name"
                      onChange={handleChange}
                    />
                  </label>
                  <label className="input-group mb-5 mt-5">
                    <span>device id Dokumen</span>
                    <input
                      type="text"
                      placeholder="nama dokumen"
                      className="input input-bordered"
                      name="device_id"
                      onChange={handleChange}
                    />
                  </label>
                  <label className="input-group mb-5 mt-5">
                    <span>uuid Dokumen</span>
                    <input
                      type="text"
                      placeholder="nama dokumen"
                      className="input input-bordered"
                      name="uuid"
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
                    placeholder="Masukkan foto ruangan lokasi"
                    className="file-input w-full max-w-xs"
                    name="photo"
                  />
                </Dialog.Description>
                <button
                  onClick={() => {
                    handleFileUpload();
                    setLoading(true);
                  }}
                  className="btn btn-success mr-3 mb-3 md:mb-0 capitalize"
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
                    "Tambahkan Dokumen"
                  )}
                </button>
                <button
                  onClick={closeModal}
                  className="btn capitalize font-semibold"
                >
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