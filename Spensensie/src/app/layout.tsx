import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeStateProvider } from "./theme-state-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "SpendSensie - Premium Personal Finance & Debt Payoff Tracker",
  description:
    "Take control of your financial wellness. Calculate memberships, compare Snowball and Avalanche debt payoff strategies, plan budgets, and track goals in one emerald-themed secure dashboard.",
  keywords: [
    "personal finance",
    "debt payoff calculator",
    "budget tracker",
    "membership cost calculator",
    "snowball strategy",
    "avalanche strategy",
    "financial wellness",
    "savings goal tracker",
  ],
  authors: [{ name: "SpendSensie Team" }],
  openGraph: {
    title: "SpendSensie - Premium Personal Finance & Debt Payoff Tracker",
    description:
      "Take control of your financial wellness. Calculate memberships, compare Snowball and Avalanche debt payoff strategies, plan budgets, and track goals.",
    type: "website",
    locale: "en_US",
    siteName: "SpendSensie",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        {/* 
          Inline script runs synchronously before paint to apply the correct
          theme class, preventing the white-flash on dark mode reload. 
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = saved ? saved === 'dark' : prefersDark;
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  }
                  // Also apply saved language to <html lang>
                  var lang = localStorage.getItem('language');
                  if (lang) {
                    document.documentElement.lang = lang;
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased min-h-screen bg-slate-50 text-slate-900 dark:bg-darkbg-900 dark:text-slate-100 transition-colors duration-200`}
      >
        <ThemeStateProvider>{children}</ThemeStateProvider>
      </body>
    </html>
  );
}
