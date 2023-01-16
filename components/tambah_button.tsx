import axios, { AxiosError } from "axios";
import { useState } from "react";
import SuccessInfo from "./success_toast";

export default function AddDocument() {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [field, setField] = useState({ namaDoc: "", lokasiDoc: "" });

  function fieldHandler(e: any) {
    setField({
      ...field,
      [e.target.name]: e.target.value,
    });
  }

  async function handleDocSubmit(e: any) {
    e.preventDefault();

    try {
      const postDocReq = await axios.post("https://dummyjson.com/auth/login", {
        Headers: {
          "Content-Type": "application/json",
        },
        namaDoc: field.namaDoc,
        // email: field.email,
        lokasiDoc: field.lokasiDoc,
      });
      const postDocRes = await postDocReq.data;
      if (postDocReq.status === 200) {
        //upload doc to database
        console.log(postDocRes);
      }
    } catch (error) {
      const err = error as AxiosError;
      console.log(err);
      setShowSnackbar(true);
    }
  }

  return (
    <>
      <label htmlFor="add-doc" className="btn btn-sm btn-success ml-auto mb-3">
        Tambah Dokumen
      </label>
      <input type="checkbox" id="add-doc" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-5">Tambah Dokumen</h3>
          {/* <p className="py-4">Apakah anda yakin ingin menghapus dokumen ini?</p> */}
          <form onSubmit={handleDocSubmit}>
            <div className="form-control">
              {/* <label className="label">
              <span className="label-text">Nama Dokumen</span>
            </label> */}
              <label className="input-group mb-5">
                <span>Nama Dokumen</span>
                <input
                  type="text"
                  placeholder="nama dokumen"
                  className="input input-bordered"
                  name="namaDoc"
                  onChange={fieldHandler}
                />
              </label>
              <label className="input-group mb-3">
                <span>Lokasi Dokumen</span>
                <input
                  type="text"
                  placeholder="Lokasi dokumen"
                  className="input input-bordered"
                  name="lokasiDoc"
                  onChange={fieldHandler}
                />
              </label>
              <label className="label">
                <span className="label-text">Masukkan foto ruangan lokasi</span>
              </label>

              <input
                type="file"
                className="file-input w-full max-w-xs"
                name="fotoLok"
                onChange={fieldHandler}
              />
            </div>
          </form>

          <div className="modal-action">
            <label htmlFor="add-doc" className="btn ">
              Batal
            </label>
            <label
              htmlFor="add-doc"
              className="btn btn-success"
              itemType="submit"
            >
              Tambahkan
            </label>
          </div>
        </div>
      </div>
      {showSnackbar && <SuccessInfo />}
    </>
  );
}
