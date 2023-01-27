import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import SuccessInfo from "../success_toast";
import Cookie from "js-cookie";
import { Dialog } from "@headlessui/react";
import { Router, useRouter } from "next/router";

export default function AddDocument(this: any) {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [field, setField] = useState({
    name: "",
    location: "",
    photo: "",
  });
  const [photoUrl, setPhotoUrl] = useState("");
  let [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [data, setData] = useState(null);
  const [secondData, setSecondData] = useState(null);

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
      photo: name === "photo" ? files[0] : field.photo,

      // photo: files ? files[0] : field.photo,
    });
  };

  async function handleFileUpload() {
    const input = document.querySelector(
      "input[type='file']"
    ) as HTMLInputElement;
    const formData = new FormData();
    formData.append("file", input.files![0]);
    const token = Cookie.get("token") as string;
    const options = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const postFileReq = await axios.post(
        "https://spda-api.onrender.com/api/file/upload",
        formData,
        options
      );
      const postFileRes = await postFileReq.data.image;
      if (postFileReq.status === 200) {
        setPhotoUrl((prev) => {
          return postFileRes;
        });

        handleDocSubmit(postFileRes);
      }
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.response?.data);
    }
  }

  async function handleDocSubmit(photoUrl: string) {
    const token = Cookie.get("token") as string;
    try {
      const postDocReq = await axios.post(
        "https://spda-api.onrender.com/api/admin/documents",
        {
          name: field.name,
          location: field.location,
          photo: photoUrl,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      const postDocRes = await postDocReq.data;
      if (postDocReq.status === 200) {
        setShowSnackbar(true);
        router.reload();

        console.log(postDocRes);
      }
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.response?.data);
    }
  }

  const fetchData = async () => {
    const input = document.querySelector(
      "input[type='file']"
    ) as HTMLInputElement;
    const formData = new FormData();
    formData.append("file", input.files![0]);
    const token = Cookie.get("token") as string;
    const options = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.post(
        "https://spda-api.onrender.com/api/file/upload",
        formData,
        options
      );
      setData(response.data.image);
      //if first api was successful,call the second api
      const secondResponse = await axios.post(
        "https://spda-api.onrender.com/api/admin/documents",
        {
          name: field.name,
          location: field.location,
          photo: data,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (secondResponse.status === 200) {
        setShowSnackbar(true);
        console.log(secondResponse.data);
      }

      console.log(secondResponse.data);
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.response?.data);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="btn btn-sm btn-success mb-3 ml-auto"
      >
        Tambah Dokumen
      </button>

      <Dialog
        open={isOpen}
        onClose={() => closeModal()}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          {showSnackbar && (
            <SuccessInfo message="Dokumen berhasil ditambahkan" />
          )}

          <Dialog.Panel className="modal-box m-5">
            <Dialog.Title className="font-bold text-lg">
              Tambah Dokumen
            </Dialog.Title>
            <Dialog.Description className="py-4 mb-4">
              Masukkan nama, lokasi, dan foto dokumen yang ingin anda tambahkan
              disini
              <label className="input-group mb-5">
                <span>Nama Dokumen</span>
                <input
                  type="text"
                  placeholder="nama dokumen"
                  className="input input-bordered"
                  name="name"
                  onChange={handleChange}
                />
              </label>
              <label className="input-group mb-3">
                <span>Lokasi Dokumen</span>
                <input
                  type="text"
                  placeholder="Lokasi dokumen"
                  className="input input-bordered"
                  name="location"
                  onChange={handleChange}
                />
              </label>
              <label className="label">
                <span className="label-text">Masukkan foto ruangan lokasi</span>
              </label>
              <input
                type="file"
                className="file-input w-full max-w-xs"
                name="photo"
                // onChange={handleFileUpload}
              />
            </Dialog.Description>
            <button onClick={handleFileUpload} className="btn btn-success mr-3">
              Tambahkan
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
