import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "gooey-toast/styles.css";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { PesertaProvider } from "@/context/peserta-context";
import { MentorProvider } from "@/context/mentor-context";
import { LogbookProvider } from "@/context/logbook-context";
import { ThemeProvider } from "@/components/theme-provider";
import { ToasterMount } from "@/components/toaster-mount";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Monitoring Magang Hub ATR/BPN",
  description: "Aplikasi monitoring peserta magang ATR/BPN",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <PesertaProvider>
              <MentorProvider>
                <LogbookProvider>{children}</LogbookProvider>
              </MentorProvider>
            </PesertaProvider>
          </AuthProvider>
          <ToasterMount />
        </ThemeProvider>
      </body>
    </html>
  );
}
