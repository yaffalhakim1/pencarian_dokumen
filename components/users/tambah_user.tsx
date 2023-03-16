import axios, { AxiosError } from "axios";
import { useState, Fragment } from "react";
import Cookie from "js-cookie";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { TailSpin } from "react-loader-spinner";
import { toast } from "sonner";
import Select from "react-select";
import useSWR from "swr";

export default function AddUser({ onSuccess }: { onSuccess: () => void }) {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [field, setField] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    password_confirmation: "",
    role: [],
  });
  const [photoUrl, setPhotoUrl] = useState("");
  let [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    setField({
      ...field,
      [e.target.name]: e.target.value,
      // photo: name === "photo" ? files[0] : field.photo,
    });
  };

  async function handleAddUser() {
    const input = document.querySelector(
      "input[type='file']"
    ) as HTMLInputElement;
    const formData = new FormData();
    // formData.append("photo", input.files![0]);
    formData.append("name", field.name);
    formData.append("email", field.email);
    formData.append("username", field.username);
    for (let i = 0; i < field.role.length; i++) {
      formData.append("role[]", field.role[i]);
    }
    formData.append("password", field.password);
    formData.append("password_confirmation", field.password_confirmation);

    try {
      const token = Cookie.get("token") as string;
      const postFileReq = await axios.post(
        "https://spda.17management.my.id/api/users/data",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "*/*",
            authorization: `Bearer ${token}`,
          },
        }
      );
      const postFileRes = await postFileReq.data;
      console.log(postFileRes, "add users from admin");
      onSuccess();
      setLoading(false);
      closeModal();
      toast.success("Pengguna baru berhasil ditambahkan");
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.status === 400) {
        toast.error(`${err.response?.data}`);
      } else {
        toast.error("Gagal menambahkan pengguna");
      }
      console.log(err.response?.data, "error upload");

      setLoading(false);
      closeModal();
    }
  }

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

  const handleSelectChange = (selectedRoles: any) => {
    const roles = selectedRoles.map((role: any) => role.label);
    setField({
      ...field,
      role: roles,
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="btn btn-sm btn-accent mb-3 mr-auto capitalize text-white"
      >
        Tambah Pengguna
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
                  Tambah Pengguna
                </Dialog.Title>
                <Dialog.Description className="py-4">
                  Masukkan data pengguna baru disini
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Nama</span>
                    <input
                      type="text"
                      placeholder="Nama Pengguna"
                      className="input input-bordered"
                      name="name"
                      onChange={handleChange}
                    />
                  </label>
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Username</span>
                    <input
                      type="text"
                      placeholder="Username pengguna"
                      className="input input-bordered"
                      name="username"
                      onChange={handleChange}
                    />
                  </label>
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Email</span>
                    <input
                      type="text"
                      placeholder="Email Pengguna"
                      className="input input-bordered"
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
                    />
                  </label>
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Password</span>
                    <input
                      type="text"
                      placeholder="Password"
                      className="input input-bordered"
                      name="password"
                      onChange={handleChange}
                    />
                  </label>
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Konfirmasi Password</span>
                    <input
                      type="text"
                      placeholder="Password"
                      className="input input-bordered"
                      name="password_confirmation"
                      onChange={handleChange}
                    />
                  </label>
                  {/* <label className="label">
                    <span className="label-text">
                      Masukkan foto ruangan lokasi
                    </span>
                  </label>
                  <input
                    type="file"
                    placeholder="Masukkan foto ruangan lokasi"
                    className="file-input w-full max-w-xs"
                    name="photo"
                  /> */}
                </Dialog.Description>
                <button
                  onClick={() => {
                    handleAddUser();
                    setLoading(true);
                  }}
                  className="btn btn-success mr-3 mb-3 md:mb-0 capitalize"
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
                      {/* <button className="btn btn-success btn-sm">
                        Menambahkan dokumen...
                      </button> */}
                    </div>
                  ) : (
                    "Tambahkan Pengguna"
                  )}
                </button>
                <button
                  onClick={closeModal}
                  className="btn capitalize font-semibold"
                >
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
