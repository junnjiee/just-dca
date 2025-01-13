import { Navbar } from "./components/Navbar";

type RootLayoutProps = {
  children: React.ReactNode;
};

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div>
      <Navbar />
      <div className="mx-2 md:mx-5 xl:mx-48 2xl:mx-72">{children}</div>
    </div>
  );
}
