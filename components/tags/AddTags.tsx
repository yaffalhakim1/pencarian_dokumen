import axios, { AxiosError } from "axios";
import { useState, Fragment } from "react";
import Cookie from "js-cookie";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { TailSpin } from "react-loader-spinner";
import { toast } from "sonner";

export default function AddTags({ onSuccess }: { onSuccess: () => void }) {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [field, setField] = useState({
    name: "",
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
    });
  };

  async function handleAddTags() {
    const input = document.querySelector(
      "input[type='file']"
    ) as HTMLInputElement;
    const formData = new FormData();
    // formData.append("photo", input.files![0]);
    formData.append("name", field.name);
    // formData.append("uuid", field.uuid);

    try {
      const token = Cookie.get("token") as string;
      const postFileReq = await axios.post(
        "https://spda.17management.my.id/api/tags/data",
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
      onSuccess();
      setLoading(false);
      closeModal();
      toast.success("Berhasil menambahkan tags");
    } catch (error: any) {
      if (error.response.status === 500) {
        toast.error("Penambahan gagal, silakan coba lagi");
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
        toast.error("Penambahan gagal, silakan coba lagi");
      }
      setLoading(false);
      closeModal();
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="btn btn-sm btn-accent mb-3 mr-auto capitalize text-white"
      >
        Tambah Tags
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
                  Tambah Tags
                </Dialog.Title>
                <Dialog.Description className="mt-1 mb-4 text-md">
                  Masukkan nama tag yang ingin anda tambahkan disini.
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Nama Tag</span>
                    <input
                      type="text"
                      placeholder="nama tag"
                      className="input input-bordered"
                      name="name"
                      onChange={handleChange}
                    />
                  </label>
                  {/* <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Tag Id Alat</span>
                    <input
                      type="text"
                      placeholder="device id dokumen"
                      className="input input-bordered"
                      name="tag_id"
                      onChange={handleChange}
                    />
                  </label> */}
                  {/* <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>uuid Dokumen</span>
                    <input
                      type="text"
                      placeholder="uuid dokumen"
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
                  /> */}
                </Dialog.Description>
                <button
                  onClick={() => {
                    handleAddTags();
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
