import React, { Fragment, useState } from "react";
import axios, { AxiosError } from "axios";
import Cookie from "js-cookie";
import { Dialog, Transition } from "@headlessui/react";
import { TailSpin } from "react-loader-spinner";
import { GetServerSideProps } from "next";

type Data = {
  name: string;
  device_id: string;
  uuid: string;
  photo: string;
  id: any;
};

export const getServerSideProps: GetServerSideProps<{ data: Data }> = async (
  context
) => {
  const id = context.query.id as string;
  const token = context.req.headers.token;
  const response = await axios.get(
    "https://spda.17management.my.id/api/documents/data" + id,
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

export default function EditUser(this: any, props: Data) {
  const data = props;
  const [field, setField] = useState({
    name: data.name,
    device_id: data.device_id,
    uuid: data.uuid,
    photo: data.photo,
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
    const id = props.id;
    const token = Cookie.get("token") as string;
    const input = document.querySelector(
      "input[type='file']"
    ) as HTMLInputElement;
    const formData = new FormData();
    // formData.append("file", input.files![0]);
    formData.append("photo", input.files![0]);
    formData.append("name", field.name);
    formData.append("device_id", field.device_id);
    formData.append("uuid", field.uuid);
    const options = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const postFileReq = await axios.post(
        `https://spda.17management.my.id/api/documents/update/${id}`,
        formData,
        options
      );
      const postFileRes = await postFileReq.data;
      setLoading(false);
      if (postFileReq.status === 200) {
        closeModal();
      }
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.response?.data);
    }
  }

  async function handleDocSubmitEdit(photoUrl: string) {
    const token = Cookie.get("token") as string;
    const id = props.id;

    try {
      const postDocReq = await axios.put(
        `https://spda-api.onrender.com/api/admin/documents/${id}`,
        {
          device_id: field.device_id,
          name: field.name,
          photo: photoUrl,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    setField({
      ...field,
      [e.target.name]: e.target.value,
      photo: name === "photo" ? files[0] : field.photo,
    });
  };

  return (
    <>
      {/* <button
        type="button"
        onClick={openModal}
        className="btn btn-sm btn-warning mb-3 ml-auto"
      >
        Ubah Dokumen
      </button> */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-edit"
        onClick={openModal}
        cursor="pointer"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>

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
                <Dialog.Title className="font-bold text-lg">
                  Ubah Dokumen
                </Dialog.Title>
                <Dialog.Description className="py-4">
                  Masukkan nama, lokasi, dan foto dokumen yang ingin anda ubah
                  disini
                  <label className="input-group mb-5">
                    <span>Nama Dokumen</span>
                    <input
                      type="text"
                      placeholder={data.name}
                      className="input input-bordered"
                      name="name"
                      onChange={handleChange}
                    />
                  </label>
                  <label className="input-group mb-3">
                    <span>Device Id Dokumen</span>
                    <input
                      type="text"
                      className="input input-bordered"
                      placeholder={data.device_id}
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
                    placeholder={data.photo}
                  />
                </Dialog.Description>
                <button
                  onClick={() => {
                    setLoading(true);
                    handleFileUpload();
                  }}
                  className="btn btn-warning mr-3 mb-3 md:mb-0"
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
                      {/* <button className="btn btn-warning btn-sm mb-3 md:mb-0">
                        Mengubah dokumen...
                      </button> */}
                    </div>
                  ) : (
                    "Ubah Dokumen"
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
