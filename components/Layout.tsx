import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-2 sm:px-4 md:px-6 lg:px-8 pb-8 sm:pb-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}

