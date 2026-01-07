import "./globals.css";
import { Providers } from "./provider/Providers";

// export const metadata = {
//   title: "TSender",
//   description: "Hyper gas-optimized bulk ERC20 token transfer",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="./window.svg" sizes="any" />
      </head>
      <body className="bg-zinc-50">
        <Providers>
          {/* <Header /> */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
