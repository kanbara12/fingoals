import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-poppins" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FinGoals - Personal Financial Tracker",
  description: "Duolingo untuk Keuangan Pribadi Anda",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="bg-slate-900 flex justify-center items-center min-h-screen font-sans">
        {/* Mobile Container Device Simulation */}
        <div className="w-full max-w-md h-[850px] bg-fingoals-purple-bg rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col border-8 border-slate-800">
          <main className="flex-1 overflow-y-auto scrollbar-none">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}