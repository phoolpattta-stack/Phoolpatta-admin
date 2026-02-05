// // // // "use client";

// // // // import { useAuth } from "@/context/AuthContext";

// // // // export default function Topbar() {
// // // //   const { logout } = useAuth();

// // // //   return (
// // // //     <header className="h-14 bg-white border-b flex items-center justify-between px-6">
// // // //       <h1 className="font-semibold">Admin Panel</h1>

// // // //       <button
// // // //         onClick={logout}
// // // //         className="text-sm bg-red-500 text-white px-3 py-1 rounded"
// // // //       >
// // // //         Logout
// // // //       </button>
// // // //     </header>
// // // //   );
// // // // }
// // // "use client";

// // // import { LogOut, Menu } from "lucide-react";
// // // import { useAuth } from "@/context/AuthContext";

// // // export default function Topbar() {
// // //   const { logout } = useAuth();

// // //   return (
// // //     <header className="h-14 bg-white border-b flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
// // //       {/* Left */}
// // //       <div className="flex items-center gap-3">
// // //         <button className="md:hidden p-2 rounded hover:bg-gray-100">
// // //           <Menu size={20} />
// // //         </button>
// // //         <h1 className="font-semibold text-gray-800">Admin Dashboard</h1>
// // //       </div>

// // //       {/* Right */}
// // //       <div className="flex items-center gap-4">
// // //         <div className="hidden sm:block text-sm text-gray-600">
// // //           Hello, Admin
// // //         </div>

// // //         <button
// // //           onClick={logout}
// // //           className="flex items-center gap-2 text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md transition"
// // //         >
// // //           <LogOut size={16} />
// // //           Logout
// // //         </button>
// // //       </div>
// // //     </header>
// // //   );
// // // }
// // "use client";

// // import { Menu, LogOut } from "lucide-react";
// // import { useAuth } from "@/context/AuthContext";

// // export default function Topbar({
// //   onMenuClick,
// // }: {
// //   onMenuClick: () => void;
// // }) {
// //   const { logout } = useAuth();

// //   return (
// //     <header className="h-14 bg-white border-b flex items-center justify-between px-4 md:px-6">
// //       <div className="flex items-center gap-3">
// //         {/* Mobile Menu Button */}
// //         <button
// //           onClick={onMenuClick}
// //           className="md:hidden p-2 rounded hover:bg-gray-100"
// //         >
// //           <Menu size={22} />
// //         </button>

// //         <h1 className="font-semibold text-gray-800">Admin Dashboard</h1>
// //       </div>

// //       <button
// //         onClick={logout}
// //         className="flex items-center gap-2 text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md"
// //       >
// //         <LogOut size={16} />
// //         Logout
// //       </button>
// //     </header>
// //   );
// // }
// "use client";

// import { Menu, LogOut } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";

// export default function Topbar({
//   onMenuClick,
// }: {
//   onMenuClick: () => void;
// }) {
//   const { logout } = useAuth();

//   return (
//     <header className="h-14 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-30">
//       <div className="flex items-center gap-3">
//         <button
//           onClick={onMenuClick}
//           className="md:hidden p-2 rounded hover:bg-gray-100"
//         >
//           <Menu size={22} />
//         </button>
//         <h1 className="font-semibold text-gray-800">Admin Dashboard</h1>
//       </div>

//       <button
//         onClick={logout}
//         className="flex items-center gap-2 text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md"
//       >
//         <LogOut size={16} />
//         Logout
//       </button>
//     </header>
//   );
// }
"use client";

import { Menu, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Topbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const { logout } = useAuth();

  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded hover:bg-gray-100"
        >
          <Menu size={22} />
        </button>

        <h1 className="font-semibold text-gray-800">Admin Dashboard</h1>
      </div>

      <button
        onClick={logout}
        className="flex items-center gap-2 text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md"
      >
        <LogOut size={16} />
        Logout
      </button>
    </header>
  );
}
