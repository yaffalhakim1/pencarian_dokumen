import Link from "next/link";
import "tailwindcss/tailwind.css";
import HomeUser from "./users/homeuser";

export default function Home() {
  return (
    <>
      <p>
        <Link href="/admin" passHref>
          Go to about page (will redirect)
        </Link>
      </p>
      <p>
        <Link href="/users" passHref>
          Go to another page (will rewrite)
        </Link>
      </p>

      <HomeUser />
    </>
  );
}
