import axios, { AxiosError } from "axios";
import { useState, Fragment, useEffect } from "react";
import Cookie from "js-cookie";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { TailSpin } from "react-loader-spinner";
import Alert from "../Alert";
import Select from "react-select";
import { toast } from "sonner";
import { getData } from "../../lib/firebase";
import "firebase/compat/database";
import firebase from "firebase/compat/app";
import useSWR from "swr";

// NOTES
// 1. scan with hardware
// 2. the uuid and device-id will be saved to the database
// 3. get the uuid and device-id from the database
// 4. show the uuid and device-id in the form

export default function AddDocument({ onSuccess }: { onSuccess: () => void }) {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [field, setField] = useState({
    name: "",
    device_id: "",
    tag: [],
    uuid: "",
  });
  const [options, setOptions] = useState<any>([]);
  const [uuid, setUuid] = useState("");
  const [deviceId, setDeviceId] = useState<number>(0);
  const [selectedValue, setSelectedValue] = useState(null);
  let [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  //get list tags
  useEffect(() => {
    const getTags = async () => {
      try {
        const token = Cookie.get("token") as string;
        const res = await axios
          .get("https://spda.17management.my.id/api/tags/list", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            const options = res.data.data.map((item: any) => {
              return {
                value: item.id,
                label: item.name,
              };
            });
            setOptions(options);
            if (options.length > 0) {
              setSelectedValue(options);
            }
          });
      } catch (error) {
        const err = error as AxiosError;
        console.log(err);
        console.log(err.response?.data, "error get tags");
      }
    };
    getTags();
  }, []);

  //get data from rtdb firebase
  useEffect(() => {
    const getDatas = async () => {
      try {
        const res: any = await getData();
        // setData(res);
        setUuid(res.uuid);
        setDeviceId(res.device_id);
        setField({
          ...field,
          uuid: res.uuid,
          device_id: res.device_id.toString(),
        });
        setIsLoading(false); // mark data as loaded
      } catch (error) {
        const err = error as AxiosError;
        console.log(err.response?.data, "error get uuid");
      }
    };
    // Call getDatas initially and attach the listener
    getDatas();
    // Return a function that detaches the listener when the component unmounts
    return () => {
      firebase.database().ref("Daftar").off();
    };
  }, []);

  //set data to input element so user can see the changes
  useEffect(() => {
    const dataRef = firebase.database().ref("Daftar");
    const handleDataChange = (snapshot: any) => {
      const data = snapshot.val();
      setUuid(data.uuid);
      setDeviceId(data.device_id);
    };
    dataRef.on("value", handleDataChange);

    return () => {
      dataRef.off("value", handleDataChange);
    };
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setField((prevField) => {
      const updatedField = {
        ...prevField,
        [name]: value,
      };
      if (name === "uuid") {
        setUuid(value);
      } else if (name === "device_id") {
        setDeviceId(value);
      }
      return updatedField;
    });
  };

  const handleSelectChange = (selectedOptions: any) => {
    const options = selectedOptions.map((option: any) => option.label);
    setField({
      ...field,
      tag: options,
    });
  };

  async function handleAddDoc() {
    const token = Cookie.get("token") as string;
    const formData = new FormData();
    formData.append("name", field.name);
    formData.append("device_id", field.device_id);
    formData.append("uuid", field.uuid);
    // field.tag.forEach((tag) => formData.append("tag[]", tag));
    for (let i = 0; i < field.tag.length; i++) {
      formData.append("tag[]", field.tag[i]);
    }
    // console.log(field.device_id);
    // console.log(field.uuid);
    // console.log(field.tag);
    const options = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .post(
        "https://spda.17management.my.id/api/documents/data",
        formData,
        options
      )
      .then((postFileReq) => {
        console.log(postFileReq, "postfile req");
        console.log(formData, "formdata handel add doc");
        onSuccess();
        setLoading(false);
        closeModal();
        toast.success("Dokumen berhasil ditambahkan");
      })
      .catch((error) => {
        const err = error as AxiosError;
        toast.error("uuid already exist or device id already exist");
        setLoading(false);
        closeModal();
        console.log(err.response, "error upload");
      });
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="btn btn-sm btn-accent mb-3 mr-auto capitalize text-white "
      >
        Tambah Dokumen
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
                <Dialog.Title className="font-bold text-xl">
                  Tambah Dokumen
                </Dialog.Title>
                <Dialog.Description className="mt-1 mb-4 text-md">
                  Masukkan nama, id alat, uuid, dan foto dokumen yang ingin anda
                  tambahkan disini.
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Nama Dokumen</span>
                    <input
                      type="text"
                      placeholder="nama dokumen"
                      className="input input-bordered"
                      name="name"
                      onChange={handleChange}
                    />
                  </label>
                  {/* https://react-select.com/home, pakai yang single */}
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>device id Dokumen</span>
                    <input
                      type="text"
                      // placeholder={data.device_id}
                      value={deviceId}
                      className="input input-bordered"
                      name="device_id"
                      onChange={handleChange}
                    />
                  </label>
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>uuid Dokumen</span>
                    <input
                      type="text"
                      // placeholder={uuid}
                      // defaultValue={uuid}
                      value={uuid}
                      className="input input-bordered"
                      name="uuid"
                      onChange={handleChange}
                      // onChange={(e) => setUuid(e.target.value)}
                    />
                  </label>
                  {/* https://react-select.com/home, pakai yang multiple */}
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Tag</span>
                    <Select
                      isMulti
                      options={options}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={handleSelectChange}
                      name="tag"
                    />
                  </label>
                </Dialog.Description>
                <button
                  onClick={() => {
                    handleAddDoc();
                    setLoading(true);
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
