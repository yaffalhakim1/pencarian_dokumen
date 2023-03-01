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
      {/* <Link href={`document/${id}`}>
        <article className="flex items-start space-x-4 mt-8">
          <img
            src={photo}
            alt=""
            width="100"
            height="100"
            className="flex-none rounded-md bg-slate-100"
          />
          <div className="min-w-0 relative flex-auto">
            <h2 className="font-semibold text-slate-900 truncate pr-20">
              {name}
            </h2>
            <dl className="mt-2 flex flex-wrap text-sm leading-6 font-medium">
              <div className="ml-0">
                <dt className="sr-only">Year</dt>
                <dd>{device_name}</dd>
              </div>

              <div className="flex-none w-full mt-2 font-normal">
                <dt className="sr-only">Cast</dt>
                <dd className="text-slate-400"> {tag.join(", ")}</dd>
              </div>
            </dl>
          </div>
        </article>
      </Link> */}
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
