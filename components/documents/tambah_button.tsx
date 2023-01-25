import axios, { AxiosError } from "axios";
import { useState } from "react";
import SuccessInfo from "../success_toast";
import Cookie from "js-cookie";
import { Dialog } from "@headlessui/react";
import { useRouter } from "next/router";
import Router from "next/router";

export default function AddDocument(this: any) {
  const router = useRouter();

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [field, setField] = useState({
    name: "",
    location: "",
    photo: "",
  });
  let [isOpen, setIsOpen] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  async function handleDocSubmit(e: any) {
    e.preventDefault();
    const token = Cookie.get("token") as string;
    console.log(`token: ${token}`);
    try {
      const postDocReq = await axios.post(
        "https://spda-api.onrender.com/api/admin/documents",
        {
          location: field.location,
          name: field.name,
          photo: field.photo,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      const postDocRes = await postDocReq.data;
      if (postDocReq.status === 200) {
        setShowSnackbar(true);
        Router.reload();
        // console.log(postDocRes);
      }
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.response?.data);
    }
  }

  function fieldHandler(e: any) {
    setField({
      ...field,
      [e.target.name]: e.target.value,
    });
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

      <Dialog
        open={isOpen}
        onClose={() => closeModal()}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          {showSnackbar && (
            <SuccessInfo message="Dokumen berhasil ditambahkan" />
          )}

          <Dialog.Panel className="modal-box m-5">
            <Dialog.Title className="font-bold text-lg">
              Tambah Dokumen
            </Dialog.Title>
            <Dialog.Description className="py-4 mb-4">
              Masukkan nama, lokasi, dan foto dokumen yang ingin anda tambahkan
              disini
              <label className="input-group mb-5">
                <span>Nama Dokumen</span>
                <input
                  type="text"
                  placeholder="nama dokumen"
                  className="input input-bordered"
                  name="name"
                  onChange={fieldHandler}
                />
              </label>
              <label className="input-group mb-3">
                <span>Lokasi Dokumen</span>
                <input
                  type="text"
                  placeholder="Lokasi dokumen"
                  className="input input-bordered"
                  name="location"
                  onChange={fieldHandler}
                />
              </label>
              <label className="label">
                <span className="label-text">Masukkan foto ruangan lokasi</span>
              </label>
              <input
                type="file"
                className="file-input w-full max-w-xs"
                name="photo"
                onChange={fieldHandler}
              />
            </Dialog.Description>
            <button onClick={handleDocSubmit} className="btn btn-success mr-3">
              Tambahkan
            </button>
            <button onClick={closeModal} className="btn">
              Batal
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
