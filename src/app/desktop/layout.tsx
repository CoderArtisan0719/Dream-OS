import { ReactNode } from "react";
import { Navbar } from "./components/Navbar";
import { Dock } from "./components/Dock";
import { Sidebar } from "./components/Sidebar";

export default async function DesktopLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className="relative flex min-h-screen w-screen items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/clouds-wallpaper.jpg')" }}
    >
      <div className="absolute inset-0 z-10 bg-black bg-opacity-20" />
      <div className="relative z-10 flex h-full min-h-screen w-full px-4">
        <Navbar />
        <Sidebar />
        <Dock />
        {children}
      </div>
    </div>
  );
}
