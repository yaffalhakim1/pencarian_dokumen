export default function DeleteButton() {
  return (
    <>
      <label htmlFor="my-modal" className="btn btn-sm btn-error mt-3 ml-3">
        Hapus Dokumen
      </label>

      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hapus Dokumen</h3>
          <p className="py-4">Apakah anda yakin ingin menghapus dokumen ini?</p>
          <div className="modal-action">
            <label htmlFor="my-modal" className="btn ">
              Tidak
            </label>
            <label htmlFor="my-modal" className="btn btn-error">
              Ya{" "}
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
