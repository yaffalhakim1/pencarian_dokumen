import DeleteButton from "../../components/button_hapus";
import EditButton from "../../components/edit_button";
import AddDocument from "../../components/tambah_button";

export default function CrudDocument() {
  return (
    <>
      <div className="container px-6 py-12 h-full">
        <div className="flex flex-col h-full w-full  ">
          {/* <div className="md:w-full lg:w-10/12 lg:ml-20"> */}

          <AddDocument />
          <div className="overflow-x-auto">
            <table className="table table-normal lg:10/12 w-full">
              {/* <!-- head --> */}
              <thead>
                <tr>
                  <th></th>
                  <th>Nama Dokumen</th>
                  <th>Lokasi Dokumen</th>
                  <th>Favorite Color</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {/* <!-- row 1 --> */}
                <tr>
                  <th>1</th>
                  <td>Cy Ganderton</td>
                  <td>Quality Control Specialist</td>
                  <td>Blue</td>
                  <td>
                    <EditButton />
                    <DeleteButton />
                  </td>
                </tr>
                {/* <!-- row 2 --> */}
                <tr className="hover">
                  <th>2</th>
                  <td>Hart Hagerty</td>
                  <td>Desktop Support Technician</td>
                  <td>Purple</td>
                </tr>
                {/* <!-- row 3 --> */}
                <tr>
                  <th>3</th>
                  <td>Brice Swyre</td>
                  <td>Tax Accountant</td>
                  <td>Red</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
}
