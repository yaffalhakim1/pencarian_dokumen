import React, { Fragment, useState } from "react";
import axios, { AxiosError } from "axios";
import Cookie from "js-cookie";
import { Dialog, Transition } from "@headlessui/react";
import { TailSpin } from "react-loader-spinner";
import { GetServerSideProps } from "next";

type Data = {
  name: string;
  tag_id: string;
  id: any;
};

interface EditButtonProps {
  datas: Data;
  onSuccess: () => void;
}

export const getServerSideProps: GetServerSideProps<{ data: Data }> = async (
  context
) => {
  const id = context.query.id as string;
  const token = context.req.headers.token;
  const response = await axios.get(
    "https://spda.17management.my.id/api/devices/data/" + id,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return {
    props: {
      token: token,
      data: response.data,
    },
  };
};

export default function EditHardware({ datas, onSuccess }: EditButtonProps) {
  const data = datas;
  const [field, setField] = useState({
    name: data.name,
    tag_id: data.tag_id,
    id: data.id,
  });
  let [isOpen, setIsOpen] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  async function handleFileUpload() {
    const id = datas.id;
    const token = Cookie.get("token") as string;
    const input = document.querySelector(
      "input[type='file']"
    ) as HTMLInputElement;
    const formData = new FormData();
    // formData.append("file", input.files![0]);
    // formData.append("photo", input.files![0]);
    formData.append("name", field.name);
    formData.append("tag_id", field.tag_id);
    // formData.append("uuid", field.uuid);
    const options = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const postFileReq = await axios.post(
        `https://spda.17management.my.id/api/devices/update/${id}`,
        formData,
        options
      );
      const postFileRes = await postFileReq.data;
      setLoading(false);
      onSuccess();
      closeModal();
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.response?.data);
    }
  }

  // async function handleDocSubmitEdit(photoUrl: string) {
  //   const token = Cookie.get("token") as string;
  //   const id = props.id;

  //   try {
  //     const postDocReq = await axios.put(
  //       `https://spda-api.onrender.com/api/admin/documents/${id}`,
  //       {
  //         device_id: field.device_id,
  //         name: field.name,
  //         photo: photoUrl,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     const postDocRes = await postDocReq.data;
  //     setLoading(false);
  //     if (postDocReq.status === 200) {
  //       setShowSnackbar(true);
  //       closeModal();
  //     }
  //   } catch (error) {
  //     const err = error as AxiosError;
  //     console.log(err.response?.data);
  //   }
  // }

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    setField({
      ...field,
      [e.target.name]: e.target.value,
      // photo: name === "photo" ? files[0] : field.photo,
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="btn btn-sm btn-warning mb-3 ml-auto capitalize text-white mr-3"
      >
        Edit
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
              <SuccessInfo message="Dokumen berhasil ditambahkan" />
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
                <Dialog.Title className="font-bold text-xl">
                  Ubah Alat
                </Dialog.Title>
                <Dialog.Description className="mt-1 mb-4 text-md">
                  Masukkan nama, id alat yang ingin anda ubah disini.
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Nama Ruangan</span>
                    <input
                      type="text"
                      placeholder={data.name}
                      className="input input-bordered"
                      name="name"
                      onChange={handleChange}
                    />
                  </label>
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Tag Id Dokumen</span>
                    <input
                      type="text"
                      className="input input-bordered"
                      placeholder={data.tag_id}
                      name="tag_id"
                      onChange={handleChange}
                    />
                  </label>
                  {/* <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>UUID Dokumen</span>
                    <input
                      type="text"
                      className="input input-bordered"
                      placeholder={data.uuid}
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
                    className="file-input w-full max-w-xs"
                    name="photo"
                    placeholder={data.photo}
                  /> */}
                </Dialog.Description>
                <button
                  onClick={() => {
                    setLoading(true);
                    handleFileUpload();
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
