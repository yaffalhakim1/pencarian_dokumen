import axios, { AxiosError } from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { TailSpin } from "react-loader-spinner";

interface Props {
  onClick: () => void;
}

export default function DeleteUser(this: any, props: Props) {
  let [isOpen, setIsOpen] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#dc2626"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-trash-2"
        onClick={openModal}
        cursor="pointer"
      >
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
      {/* <button
        type="button"
        onClick={openModal}
        className="btn btn-sm btn-error mt-3"
      >
        Hapus Dokumen
      </button> */}

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
            {/* {showSnackbar && <SuccessInfo message="Dokumen berhasil dihapus" />} */}
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
                <Dialog.Description className="py-4">
                  Apakah anda yakin ingin menghapus dokumen ini? setelah
                  menghapus dokumen ini, anda tidak dapat mengembalikannya lagi.
                </Dialog.Description>
                <button
                  onClick={() => {
                    props.onClick && props.onClick();
                    setLoading(true);
                  }}
                  className="btn btn-error mr-3 mb-3 md:mb-0"
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
                      {/* <button className="btn btn-error btn-sm">
                        Menghapus dokumen...
                      </button> */}
                    </div>
                  ) : (
                    "Hapus Dokumen"
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
