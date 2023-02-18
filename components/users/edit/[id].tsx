import React, { Fragment, useState } from "react";
import axios, { AxiosError } from "axios";
import Cookie from "js-cookie";
import { Dialog, Transition } from "@headlessui/react";
import { TailSpin } from "react-loader-spinner";
import { GetServerSideProps } from "next";

type Data = {
  name: string;
  username: string;
  email: string;
  // photo: string;
  id: any;
};

export const getServerSideProps: GetServerSideProps<{ data: Data }> = async (
  context
) => {
  const id = context.query.id as string;
  const token = context.req.headers.token;
  const response = await axios.get(
    `https://spda.17management.my.id/api/users/update/${id}`,
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
    username: data.username,
    email: data.email,
    // photo: data.photo,
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
    // formData.append("photo", input.files![0]);
    formData.append("name", field.name);
    formData.append("username", field.username);
    formData.append("email", field.email);
    const options = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const postUserReq = await axios.post(
        `https://spda.17management.my.id/api/users/update/${id}`,
        formData,
        options
      );
      const postUserRes = await postUserReq.data;
      console.log(formData);
      console.log(postUserRes);
      setLoading(false);
      if (postUserRes.status === 200) {
        console.log(postUserRes);
        closeModal();
      }
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
                <Dialog.Title className="font-semibold text-xl">
                  Ubah Data User
                </Dialog.Title>
                <Dialog.Description className="mt-1 mb-4 text-md">
                  Masukkan nama, username, dan email user yang ingin anda ubah
                  disini
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span className="pr-12">Nama</span>
                    <input
                      type="text"
                      placeholder={data.name}
                      className="input input-bordered w-full"
                      name="name"
                      onChange={handleChange}
                    />
                  </label>
                  <label className=" md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Username</span>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      placeholder={data.username}
                      name="username"
                      onChange={handleChange}
                    />
                  </label>
                  <label className=" md:mb-9 mt-5 mb-6 input-group input-group-vertical">
                    <span className="pr-12">Email</span>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      placeholder={data.email}
                      name="email"
                      onChange={handleChange}
                    />
                  </label>
                  {/* <label className="label">
                    <span className="label-text">
                      Masukkan foto ruangan lokasi
                    </span>
                  </label> */}
                  {/* <input
                    type="file"
                    className="file-input w-full max-w-xs"
                    name="photo"
                    placeholder={data.email}
                  /> */}
                </Dialog.Description>
                <div className="">
                  <button
                    onClick={() => {
                      setLoading(true);
                      handleFileUpload();
                    }}
                    className="btn btn-accent  mr-3 mb-3 md:mb-0 capitalize text-white"
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
                      "Simpan"
                    )}
                  </button>

                  <button onClick={closeModal} className="btn capitalize">
                    Batal
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
