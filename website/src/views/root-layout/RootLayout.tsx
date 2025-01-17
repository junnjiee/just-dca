import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

type RootLayoutProps = {
  children: React.ReactNode;
};

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div>
      <Navbar />
      <div className="mx-2 my-10 md:mx-5 xl:mx-48 2xl:mx-72">{children}</div>
      <Footer />
    </div>
  );
}
