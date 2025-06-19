// pages/_app.js
import Navbar from "@/components/Navbar";
import "@/styles/globals.css"; // if you're using global styles

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}
