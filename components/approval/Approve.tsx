import axios, { AxiosError } from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { TailSpin } from "react-loader-spinner";

interface Props {
  id: any;
  onDeleteSuccess?: () => {};
  onSuccess: () => void;
  onClick?: () => void;
}

export default function Approve(props: Props) {
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
      <button
        type="button"
        onClick={openModal}
        className="btn btn-sm btn-accent mb-3 capitalize text-white mr-3"
      >
        Setuju
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
                  Setujui Penghapusan
                </Dialog.Title>
                <Dialog.Description className="mt-1 mb-6">
                  Apakah anda yakin ingin menyetujui penghapusan ini? Aksi ini
                  tidak dapat dibatalkan.
                </Dialog.Description>
                <button
                  onClick={() => {
                    props.onClick && props.onClick();
                    setLoading(true);
                    closeModal();
                  }}
                  className="btn btn-error mr-3 mb-3 md:mb-0 capitalize text-white"
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
                    "Setuju"
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
