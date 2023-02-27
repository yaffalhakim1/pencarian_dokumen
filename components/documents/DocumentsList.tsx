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
              {/* <div className="absolute top-0 right-0 flex items-center space-x-1">
                        <dt className="text-sky-500">
                          <span className="sr-only">Star rating</span>
                          <svg width="16" height="20" fill="currentColor">
                            <path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
                          </svg>
                        </dt>
                        <dd>{movie.starRating}</dd>
                      </div> 
                      <div>
            <dt className="sr-only">Rating</dt>
            <dd className="px-1.5 ring-1 ring-slate-200 rounded">{movie.rating}</dd>
          </div> */}
              <div className="ml-0">
                <dt className="sr-only">Year</dt>
                <dd>{device_name}</dd>
              </div>
              {/* <div>
                        <dt className="sr-only">Genre</dt>
                        <dd className="flex items-center">
                          <svg
                            width="2"
                            height="2"
                            fill="currentColor"
                            className="mx-2 text-slate-300"
                            aria-hidden="true"
                          >
                            <circle cx="1" cy="1" r="1" />
                          </svg>
                          {document.tag.join(", ")}
                        </dd>
                      </div> */}
              {/* <div>
                        <dt className="sr-only">Runtime</dt>
                        <dd className="flex items-center">
                          <svg
                            width="2"
                            height="2"
                            fill="currentColor"
                            className="mx-2 text-slate-300"
                            aria-hidden="true"
                          >
                            <circle cx="1" cy="1" r="1" />
                          </svg>
                          {movie.runtime}
                        </dd>
                      </div> */}
              <div className="flex-none w-full mt-2 font-normal">
                <dt className="sr-only">Cast</dt>
                <dd className="text-slate-400"> {tag.join(", ")}</dd>
              </div>
            </dl>
          </div>
        </article>
      </Link>
    </>
  );
}
