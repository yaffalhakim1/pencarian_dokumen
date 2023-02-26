import React, { Fragment, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Cookie from "js-cookie";
import { Dialog, Transition } from "@headlessui/react";
import { TailSpin } from "react-loader-spinner";
import { GetServerSideProps } from "next";
import { toast } from "sonner";
import Select from "react-select";

type Data = {
  name: string;
  device_id: string;
  tag: Array<string>;
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

export default function EditDocs({ datas, onSuccess }: EditButtonProps) {
  const data = datas;
  const defaultValue = data.tag.map((tag: any) => ({ value: tag, label: tag }));
  const [field, setField] = useState({
    name: data.name,
    device_id: data.device_id,
    tag: data.tag,
  });
  let [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<any>([]);
  const [selectedValue, setSelectedValue] = useState<any>([]);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  async function handleEdit() {
    const id = datas.id;
    const token = Cookie.get("token") as string;
    const formData = new FormData();
    formData.append("name", field.name);
    formData.append("device_id", field.device_id);
    // formData.append("tag[]", field.tag.join(""));
    // field.tag.forEach((tag) => formData.append("tag[]", tag));
    for (let i = 0; i < field.tag.length; i++) {
      formData.append("tag[]", field.tag[i]);
    }
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

      setLoading(false);
      onSuccess();
      closeModal();
      toast.success("Dokumen berhasil dirubah");
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.response?.data);
    }
  }

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
        console.log(err.response?.data, "error get tags");
      }
    };
    getTags();
  }, []);

  const handleSelectChange = (selectedOptions: any) => {
    const options = selectedOptions.map((option: any) => option.label);
    setField({
      ...field,
      tag: options,
    });
  };

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    setField({
      ...field,
      [e.target.name]: e.target.value,
    });
  };

  // const defaultValue = data.tag.flatMap((tag) =>
  //   tag.split(",").map((label) => ({ label }))
  // );

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
                  Ubah Dokumen
                </Dialog.Title>
                <Dialog.Description className="mt-1 mb-4 text-md">
                  Masukkan nama, id alat, uuid, dan foto dokumen yang ingin anda
                  ubah disini.
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Nama Dokumen</span>
                    <input
                      type="text"
                      placeholder={data.name}
                      className="input input-bordered"
                      name="name"
                      onChange={handleChange}
                    />
                  </label>
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    {/* supposed to be dropdown but with one option */}
                    <span>Device Id Dokumen</span>
                    <input
                      type="text"
                      className="input input-bordered"
                      placeholder={data.device_id}
                      name="device_id"
                      onChange={handleChange}
                    />
                  </label>
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Tag</span>
                    {/* bug supposed to be show the exisiting value */}
                    <Select
                      name="tag[]"
                      isMulti
                      options={options}
                      className="basic-multi-select"
                      onChange={handleSelectChange}
                      // placeholder={data.tag}
                      defaultValue={defaultValue}
                      classNamePrefix="select"
                    />
                  </label>
                </Dialog.Description>
                <button
                  onClick={() => {
                    setLoading(true);
                    handleEdit();
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
