import axios, { AxiosError } from "axios";
import { useState, Fragment } from "react";
import Cookie from "js-cookie";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { TailSpin } from "react-loader-spinner";
import Alert from "../Alert";

export default function AddDocument(this: any) {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [field, setField] = useState({
    name: "",
    location: "",
    photo: "",
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
    formData.append("file", input.files![0]);
    const token = Cookie.get("token") as string;
    const options = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const postFileReq = await axios.post(
        "https://spda-api.onrender.com/api/file/upload",
        formData,
        options
      );
      const postFileRes = await postFileReq.data.image;
      setLoading(false);

      if (postFileReq.status === 200) {
        setPhotoUrl((prev) => {
          return postFileRes;
        });

        handleDocSubmit(postFileRes);
      }
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.response?.data);
    }
  }

  async function handleDocSubmit(photoUrl: string) {
    const token = Cookie.get("token") as string;
    try {
      const postDocReq = await axios.post(
        "https://spda-api.onrender.com/api/admin/documents",
        {
          name: field.name,
          location: field.location,
          photo: photoUrl,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      const postDocRes = await postDocReq.data;
      setLoading(false);

      if (postDocReq.status === 200) {
        setShowSnackbar(true);
        closeModal();
      }
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.response?.data);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="btn btn-sm btn-success mb-3 ml-auto"
      >
        Tambah Dokumen
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
                  Tambah Dokumen
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
                  <label className="input-group mb-3">
                    <span>Lokasi Dokumen</span>
                    <input
                      type="text"
                      placeholder="Lokasi dokumen"
                      className="input input-bordered"
                      name="location"
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
                    className="file-input w-full max-w-xs"
                    name="photo"
                  />
                </Dialog.Description>
                <button
                  onClick={() => {
                    handleFileUpload();
                    setLoading(true);
                  }}
                  className="btn btn-success mr-3 mb-3 md:mb-0"
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
                      <button className="btn btn-success btn-sm">
                        Menambahkan dokumen...
                      </button>
                    </div>
                  ) : (
                    "Tambahkan Dokumen"
                  )}
                </button>
                <button onClick={closeModal} className="btn">
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
