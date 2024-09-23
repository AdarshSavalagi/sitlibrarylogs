
import "./globals.css";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import {Toaster} from "react-hot-toast";


export const metadata = {
  title: "Library Logs",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
      >
      <NavBar/>
      <Toaster />
        {children}
      <Footer/>
      </body>
    </html>
  );
}
