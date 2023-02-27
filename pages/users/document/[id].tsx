import axios from "axios";
import { GetServerSideProps } from "next";
import Cookie from "js-cookie";
import Link from "next/link";

type Data = {
  id: any;
  uuid: string;
  name: string;
  device_id: number;
  tag: string[];
  created_at: string;
  updated_at: string;
  deleted_at: string;
  created_by: string;
  updated_by: string;
  deleted_by: string;
  device_name: string;
  photo: string;
  room_name: string;
  table_name: string;
};

interface Props {
  data: Data;
}

export const getServerSideProps: GetServerSideProps<{ data: Data }> = async (
  context
) => {
  const id = context.query.id as any;
  const token = context.req.cookies.token as any;

  const response = await axios.get(
    "https://spda.17management.my.id/api/documents/data/" + id,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return {
    props: {
      token: token,
      data: response.data.data,
    },
  };
};

export default function DocumentPage({ data }: Props) {
  const datas = data;

  return (
    <>
      <div className="p-4">
        <Link href="/" legacyBehavior>
          <a className=" hover:text-blue-700">Back</a>
        </Link>
        <h1 className="text-center font-semibold text-xl">Detail Dokumen</h1>
        <img src={datas.photo} alt="" className="mx-auto mt-4" />
        <h1 className=" text-slate-900 truncate pr-20 mt-4">
          <span className="font-normal">Nama : </span> {datas.name}
        </h1>
        <p>Alat : {datas.device_name}</p>
        <p>Tag : {datas.tag.join(", ")}</p>
        <p>Ruang : {datas.room_name}</p>
        <p>Meja : {datas.table_name}</p>
      </div>
    </>
  );
}
