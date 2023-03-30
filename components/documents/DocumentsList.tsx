import Link from "next/link";
import React from "react";

export default function DocumentsDetail({
  id,
  uuid,
  name,
  device_id,
  tag,
  created_at,
  updated_at,
  deleted_at,
  created_by,
  updated_by,
  deleted_by,
  device_name,
  photo,
}: {
  id?: any;
  uuid?: string;
  name?: string;
  device_id?: number;
  tag: string[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  created_by?: string;
  updated_by?: string;
  deleted_by?: string;
  device_name?: string;
  photo?: string;
}) {
  return (
    <>
      <Link href={`document/${id}`}>
        <div className="card w-auto bg-base-100 rounded-lg shadow-lg my-1 p-3">
          <div className="flex justify-start">
            <span className="mr-2">
              <h1 className="font-bold text-lg">{name}</h1>
            </span>
            {tag.map((item) => (
              <button
                className="btn btn-success no-animation btn-xs mx-1 text-white"
                key={item}
              >
                {item}
              </button>
            ))}
          </div>
          <p className="">{device_name}</p>
        </div>
      </Link>
    </>
  );
}
