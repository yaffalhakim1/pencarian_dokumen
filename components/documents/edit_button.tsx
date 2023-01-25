import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import Cookie from "js-cookie";
import { Dialog } from "@headlessui/react";
import SuccessInfo from "../success_toast";
import Router from "next/router";

interface Props {
  id: any;
}

export async function getServerSideProps(props: Props) {
  const id = props.id;
  const token = Cookie.get("token") as string;

  const documentHistory = await axios.get(
    `https://spda-api.onrender.com/api/admin/documents/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const docHistoryRes = await documentHistory.data;

  return {
    props: {
      token: token,
      document: docHistoryRes.data,
    },
  };
}

export default function EditButton(props: any) {
  const document = props;
  const [field, setField] = React.useState({
    name: document.name,
    location: document.location,
    photo: document.photo,
  });
  let [isOpen, setIsOpen] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  async function handleDocSubmitEdit(e: any) {
    const token = Cookie.get("token") as string;
    try {
      const postDocReq = await axios.put(
        `https://spda-api.onrender.com/api/admin/documents/${document.id}`,
        {
          location: field.location,
          name: field.name,
          photo: field.photo,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
        className="btn btn-sm btn-warning mb-3 ml-auto"
      >
        Edit Dokumen
      </button>

      <Dialog
        open={isOpen}
        onClose={() => closeModal()}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          {showSnackbar && <SuccessInfo message="Dokumen berhasil diubah" />}

          <Dialog.Panel className="modal-box m-5">
            <Dialog.Title className="font-bold text-lg">
              Tambah Dokumen
            </Dialog.Title>
            <Dialog.Description className="py-4 mb-4">
              Masukkan nama, lokasi, dan foto dokumen yang ingin anda ubah
              disini
              <label className="input-group mb-5">
                <span>Nama Dokumen</span>
                <input
                  type="text"
                  placeholder={document.name}
                  className="input input-bordered"
                  name="name"
                  onChange={fieldHandler}
                />
              </label>
              <label className="input-group mb-3">
                <span>Lokasi Dokumen</span>
                <input
                  type="text"
                  placeholder={document.location}
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
            <button
              onClick={handleDocSubmitEdit}
              className="btn btn-warning mr-3"
            >
              Ubah Dokumen
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
