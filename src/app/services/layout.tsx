import type { Metadata } from 'next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata: Metadata = {
  title: 'Services - SynapseIQ | AI Solutions for African Businesses',
  description: 'Explore our range of AI services tailored for African businesses, including chatbots, automation, machine learning, NLP, and strategic consulting.',
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="pt-20">
        {children}
      </div>
      <Footer />
    </>
  );
}
