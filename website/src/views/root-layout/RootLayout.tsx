import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

type RootLayoutProps = {
  children: React.ReactNode;
};

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div>
      <Navbar />
      <div className="mx-2 mt-5 mb-10 md:mx-5 xl:mx-32 2xl:mx-64">{children}</div>
      <Footer />
    </div>
  );
}
