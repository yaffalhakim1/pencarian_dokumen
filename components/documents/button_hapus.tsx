import Cookie from "js-cookie";
import axios, { AxiosError } from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Router from "next/router";
import SuccessInfo from "../success_toast";

interface Props {
  id: any;
}

export default function DeleteButton(this: any, props: Props) {
  const token = Cookie.get("token") as string;
  const url = "https://spda-api.onrender.com/api/admin/documents";
  const id = props.id;
  let [isOpen, setIsOpen] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  async function deleteDoc() {
    try {
      const res = await axios.delete(`${url}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status == 200) {
        setShowSnackbar(true);
        Router.reload();
        // console.log(res);
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
        className="btn btn-sm btn-error mt-3 ml-3"
      >
        Hapus Dokumen
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
            {showSnackbar && <SuccessInfo message="Dokumen berhasil dihapus" />}
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
                  Hapus Dokumen
                </Dialog.Title>
                <Dialog.Description className="py-4 mb-4">
                  Apakah anda yakin ingin menghapus dokumen ini? setelah
                  menghapus dokumen ini, anda tidak dapat mengembalikannya lagi.
                </Dialog.Description>
                <button onClick={deleteDoc} className="btn btn-error mr-3">
                  Hapus
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
