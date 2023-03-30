import Image from "next/image";

export default function Unauthorized() {
  return (
    <div className="text-center">
      <Image
        src="/images/unauth.png"
        width={500}
        height={500}
        alt={""}
        className="flex mx-auto"
      />
      <h1 className="text-2xl">Anda dilarang mengakses halaman ini</h1>
    </div>
  );
}
