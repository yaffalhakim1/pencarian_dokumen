import AddDocument from "../../components/documents/tambah_button";
import useSWR from "swr";
import EditButton from "../../components/documents/edit_button";
import DeleteButton from "../../components/documents/button_hapus";

export default function CrudAlat() {
  const fetcher = (...args: [string, RequestInit?]) =>
    fetch(...args).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    "https://spda-api.onrender.com/api/documents",
    fetcher
  );
  if (isLoading) return <div className="mx-auto">Loading...</div>;
  if (error) return <div className="mx-auto">Failed to load</div>;

  //get data using axios

  return (
    <>
      <div className="container px-6 py-12 h-full">
        <div className="flex flex-col h-full w-full  ">
          {/* <div className="md:w-full lg:w-10/12 lg:ml-20"> */}
          <AddDocument />
          <div className="overflow-x-auto">
            <table className="table table-normal lg:10/12 w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Nama Alat</th>
                  <th>Lokasi Alat</th>
                  <th>Letak Meja Alat</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.map((item: any) => (
                  <tr key={item.id}>
                    <th></th>
                    <td>{item.name}</td>
                    <td>{item.location}</td>
                    <td>
                      <img src={item.photo} alt="" width={60} />
                    </td>

                    <td>
                      <EditButton />
                      {/* <DeleteButton /> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
