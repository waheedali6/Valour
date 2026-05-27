import 'bootstrap/dist/css/bootstrap.min.css'
import "./globals.css";
import "./responsive.css";
import CustomCursor from "@/components/CustomCursor";
import PageTransition from "@/components/PageTransition";
import ScrollProvider from "@/components/ScrollProvider";



export default function RootLayout({ children }) {

  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
          <ScrollProvider />
        <PageTransition />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
