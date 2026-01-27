import "./globals.css";
import { Providers } from "../app/provider/providers";
import { ToastProvider } from "../app/context/ToastContext";

export const metadata = {
  title: "Staking Dapps",
  description: "Stake your tokens to earn rewards.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="./window.svg" sizes="any" />
      </head>
      <body className="bg-zinc-50">
        <Providers>
          <ToastProvider>{children}</ToastProvider>
          {/* <Header /> */}
        </Providers>
      </body>
    </html>
  );
}
