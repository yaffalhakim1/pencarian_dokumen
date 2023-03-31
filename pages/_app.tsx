import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";
import { Poppins } from "@next/font/google";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={poppins.className}>
      <Component {...pageProps} /> <Toaster richColors closeButton />
    </main>
  );
}
