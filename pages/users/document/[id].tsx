import axios from "axios";
import { GetServerSideProps } from "next";
import Cookie from "js-cookie";
import Link from "next/link";
import useSWR, { mutate } from "swr";
import { useState } from "react";
import { useRouter } from "next/router";
import IconRefreshCircleOutline from "../../../components/icons";
import { TailSpin } from "react-loader-spinner";

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

const fetcher = async (url: string, token: string) => {
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

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

export default function DocumentPage() {
  const router = useRouter();
  const { id } = router.query;
  const token = Cookie.get("token");
  const [isClicked, setIsClicked] = useState(false);

  const fetcher = async (url: string) => {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  };

  const { data, error } = useSWR<Data>(
    id ? `https://spda.17management.my.id/api/documents/data/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval(latestData) {
        return latestData ? 5000 : 0;
      },
    }
  );

  const handleRefresh = async () => {
    await mutate(
      `https://spda.17management.my.id/api/documents/data/${id}`,
      async (data: any) => {
        const response = await axios.get(
          `https://spda.17management.my.id/api/documents/data/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data.data;
      },
      false
    );
    console.log(data);
  };

  if (error) return <div>Error fetching document</div>;
  if (!data)
    return (
      <div className=" flex justify-center items-center min-h-screen">
        <TailSpin
          height="20"
          width="20"
          color="#000000"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass="mr-3"
          visible={true}
        />
        <p className="text-center text-xl">Mohon tunggu...</p>
      </div>
    );

  const handleClick = () => {
    setIsClicked(true);
    handleRefresh();
    setTimeout(() => {
      setIsClicked(false);
    }, 300);
  };

  return (
    <>
      <div className="card w-auto bg-base-100 shadow-2xl">
        <Link href="/" legacyBehavior>
          <a className=" hover:text-blue-700 ml-10 mt-10">Back</a>
        </Link>
        <figure className="p-1 rounded-md mx-10 mt-10 shadow-xl bg-warning bg-blend-overlay">
          <img src={data.photo} alt="Images" className="rounded-xl" />
        </figure>
        <div className="flex justify-center mt-7">
          {data.tag.map((item) => (
            <button
              className="btn btn-sm btn-success rounded-sm mx-1 shadow-lg text-white"
              key={item}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="card-body items-center text-center">
          <div className="flex">
            <h1 className="card-title text-3xl ">{data.name}</h1>
            <button
              className={` ${isClicked ? "animate-spin text-green-500" : ""}`}
              onClick={handleClick}
            >
              <IconRefreshCircleOutline
                width={30}
                height={30}
                className="ml-2"
              />
            </button>
          </div>
          <p className="font-sans">
            Dokumen ini berada di Ruang {data.room_name} dengan radius maksimal
            10m dari {data.table_name}
          </p>
        </div>
      </div>
    </>
  );
}
