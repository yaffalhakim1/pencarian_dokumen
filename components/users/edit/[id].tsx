import React, { Fragment, useState } from "react";
import axios, { AxiosError } from "axios";
import Cookie from "js-cookie";
import { Dialog, Transition } from "@headlessui/react";
import { TailSpin } from "react-loader-spinner";
import { GetServerSideProps } from "next";
import { toast } from "sonner";
import Select from "react-select";
import useSWR from "swr";
type Data = {
  name: string;
  username: string;
  email: string;
  role: any;

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

export default function EditUser({ datas, onSuccess }: EditButtonProps) {
  const data = datas;

  const defaultValueUser = data.role.map((role: any) => ({
    label: role,
  }));
  const [field, setField] = useState({
    name: data.name,
    username: data.username,
    email: data.email,
    role: data.role,
  });
  let [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  async function handleEditUser() {
    const id = datas.id;
    const token = Cookie.get("token") as string;
    const input = document.querySelector(
      "input[type='file']"
    ) as HTMLInputElement;
    const formData = new FormData();
    formData.append("name", field.name);
    formData.append("username", field.username);
    formData.append("email", field.email);
    for (let i = 0; i < field.role.length; i++) {
      formData.append("role[]", field.role[i]);
    }
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
      setLoading(false);
      onSuccess();
      toast.success("Data User berhasil diubah");
      closeModal();
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.response?.data);
      toast.success("Data User gagal diubah");
      setLoading(false);
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

  const token = Cookie.get("token") as string;
  const { data: roles, error: tagsError } = useSWR(
    "https://spda.17management.my.id/api/users/roles/list",
    (url) =>
      axios
        .get(url, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) =>
          res.data.data.map((item: { id: any; name: any }) => ({
            value: item.id,
            label: item.name,
          }))
        )
  );

  const handleSelectChange = (selectedRole: any) => {
    const options = selectedRole.map((role: any) => role.label);
    setField({
      ...field,
      role: options,
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
                  Ubah Data Pengguna
                </Dialog.Title>
                <Dialog.Description className="mt-1 mb-4 text-md">
                  Masukkan nama, username, email, role pengguna yang ingin anda
                  ubah disini
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
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Role</span>
                    <Select
                      isMulti
                      options={roles}
                      className="basic-multi-select"
                      classNamePrefix="Role"
                      onChange={handleSelectChange}
                      name="role"
                      defaultValue={defaultValueUser}
                    />
                  </label>
                </Dialog.Description>
                <div className="">
                  <button
                    onClick={() => {
                      handleEditUser();
                      setLoading(true);
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
