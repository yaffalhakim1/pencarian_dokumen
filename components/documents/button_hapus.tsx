import Cookie from "js-cookie";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

interface Props {
  id: any;
}

export default function DeleteButton(this: any, props: Props) {
  const token = Cookie.get("token") as string;
  const url = "https://spda-api.onrender.com/api/admin/documents";
  const id = props.id;
  const router = useRouter();
  let [isOpen, setIsOpen] = useState(false);

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

      console.log(res);
      router.reload();
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

      <Dialog
        open={isOpen}
        onClose={() => closeModal()}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="modal-box m-5">
            <Dialog.Title className="font-bold text-lg">
              Hapus Dokumen
            </Dialog.Title>
            <Dialog.Description className="py-4">
              Apakah anda yakin ingin menghapus dokumen ini? setelah menghapus
              dokumen ini, anda tidak dapat mengembalikannya lagi.
            </Dialog.Description>
            <button onClick={deleteDoc} className="btn btn-error mr-3">
              Hapus
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
