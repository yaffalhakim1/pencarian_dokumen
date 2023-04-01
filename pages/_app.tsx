import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";
import { Plus_Jakarta_Sans } from "@next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={plusJakartaSans.className}>
      <Component {...pageProps} /> <Toaster richColors closeButton />
    </main>
  );
}
