import './globals.css';
import { Inter, Montserrat } from 'next/font/google';
import type { Metadata } from 'next';
import { DarkModeProvider } from '@/context/DarkModeContext';
import dynamic from 'next/dynamic';

// Dynamically import the ChatbotButton to avoid SSR issues with window object
const ChatbotButton = dynamic(() => import('@/components/ChatbotButton'), {
  ssr: false,
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'SynapseIQ - AI Solutions for Africa\'s Next Growth Story',
  description: 'We empower African businesses, startups, and organizations with AI-driven tools that cut costs, improve services, and unlock new opportunities.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body>
        <DarkModeProvider>
          {children}
          <ChatbotButton />
        </DarkModeProvider>
      </body>
    </html>
  );
}
