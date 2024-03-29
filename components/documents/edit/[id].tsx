import React, { Fragment, useEffect, useState } from "react";
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
  device_id: string;
  tag: Array<string>;
  uuid: any;
  id: any;
  code: any;
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
    uuid: data.uuid,
    tag: data.tag,
    code: data.code,
  });
  let [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedValue, setSelectedValue] = useState<any>([]);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  async function handleEditDoc() {
    const id = datas.id;
    const token = Cookie.get("token") as string;
    const formData = new FormData();
    formData.append("name", field.name);
    formData.append("device_id", field.device_id);
    formData.append("uuid", field.uuid);
    formData.append("code", field.code);

    if (field.tag.length === 0) {
      formData.append("tag[]", "");
    }
    field.tag.forEach((tag: any) => {
      formData.append("tag[]", tag);
    });
    // for (let i = 0; i < field.tag.length; i++) {
    //   formData.append("tag[]", field.tag[i]);
    // }

    // formData.append("tag[]", JSON.stringify(field.tag));

    console.log(field.tag);

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
    } catch (error: any) {
      if (error.response.status === 500) {
        toast.error("Penyuntingan gagal, silakan coba lagi");
      } else if (
        error.response.data &&
        error.response.data.message &&
        typeof error.response.data.message === "object"
      ) {
        const errors = error.response.data.message;
        for (const field in errors) {
          errors[field].forEach((error: string) => {
            toast.error(error);
          });
        }
      } else {
        toast.error("Penyuntingan gagal, silakan coba lagi");
      }
      setLoading(false);
      closeModal();
    }
  }

  //get list tags
  const token = Cookie.get("token") as string;

  const { data: tags, error: tagsError } = useSWR(
    "https://spda.17management.my.id/api/tags/list",
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
  const { data: devices, error: devicesError } = useSWR(
    "https://spda.17management.my.id/api/devices/list",
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

  // const handleSelectChange = (selectedOptions: any) => {
  //   const options = selectedOptions.map((option: any) => option.label);

  //   setField({
  //     ...field,
  //     tag: options,
  //   });
  // };

  const handleSelectChange = (selectedOptions: any) => {
    const options = selectedOptions
      ? selectedOptions.map((option: any) => option.label)
      : [];
    setField({ ...field, tag: options });
    if (selectedOptions === null) {
      setField({ ...field, tag: [] });
    }
  };

  const handleSelectDeviceChange = (selectedDevice: any) => {
    const device_id = selectedDevice.value;
    setField((prevField) => ({
      ...prevField,
      device_id: device_id,
    }));
  };

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    setField({
      ...field,
      [e.target.name]: e.target.value,
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
                    <span>Kode Dokumen</span>
                    <input
                      type="text"
                      placeholder={data.code}
                      className="input input-bordered"
                      name="code"
                      onChange={handleChange}
                    />
                  </label>
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Device Id Dokumen</span>
                    <Select
                      options={devices}
                      className="basic-single"
                      classNamePrefix="select"
                      onChange={handleSelectDeviceChange}
                      name="device_id"
                    />
                  </label>
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>uuid Dokumen</span>
                    <input
                      type="text"
                      className="input input-bordered"
                      placeholder={data.uuid}
                      defaultValue={data.uuid}
                      name="uuid"
                      onChange={handleChange}
                    />
                  </label>
                  <label className="md:mb-3 mt-5 mb-6 input-group input-group-vertical">
                    <span>Tag</span>
                    <Select
                      name="tag[]"
                      isMulti
                      options={tags}
                      className="basic-multi-select"
                      onChange={handleSelectChange}
                      defaultValue={defaultValue}
                      classNamePrefix="select"
                      isClearable
                    />
                  </label>
                </Dialog.Description>
                <button
                  onClick={() => {
                    setLoading(true);
                    handleEditDoc();
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
                </button>{" "}
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
