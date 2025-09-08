// components/Navbar.tsx
"use client";
import { FaPowerOff } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

interface NavbarProps {
  firstName: string;
  onLogout: () => void;
  dashboardType?: "employee" | "publisher";
}

export default function Navbar({ firstName, onLogout, dashboardType }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSettings = () => {
    // Fix: Use includes() or check the actual pathname structure
    if (pathname.includes("/employeedashboard") || dashboardType === "employee") {
      router.push("/employee-settings");    
    } else if (pathname.includes("/publisherdashboard") || dashboardType === "publisher") {
      router.push("");
    } else {
      console.warn("Unknown dashboard path:", pathname);
    }
  };

  const handleLogoClick = () => {
    // Navigate to home or respective dashboard based on type
    if (dashboardType === "employee") {
      router.push("/employeedashboard");    
    } else if (dashboardType === "publisher") {
      router.push("/publisherdashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <nav className="flex items-center justify-between bg-black/60 backdrop-blur-md p-4 shadow-md z-10 relative">
      {/* Logo */}
      <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
        <Image src="/logo.png" width={120} height={40} alt="QuickJob Logo" />
        <span className="text-xl font-bold text-white ml-2">QuickJob</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-gray-200 font-semibold">
          Welcome, <span className="text-purple-400">{firstName || "User"}</span>
        </span>

        {/* Account Settings */}
        <button
          onClick={handleSettings}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition"
        >
          <Image src="/user.png" width={30} height={30} alt="Profile" className="rounded-full" />
          <FiSettings className="text-gray-300" />
          <span className="text-sm text-gray-300">Settings</span>
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-red-600/80 hover:bg-red-700/90 px-3 py-1 rounded-lg transition"
        >
          <FaPowerOff />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
