// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   LayoutDashboard,
//   ShoppingBag,
//   Package,
//   Users,
//   TicketPercent,
//   Boxes,
//   CreditCard,
//   Settings,
// } from "lucide-react";

// const menu = [
//   { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
//   { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
//   { name: "Products", path: "/admin/products", icon: Package },
//   { name: "Users", path: "/admin/users", icon: Users },
//   { name: "Coupons", path: "/admin/coupons", icon: TicketPercent },
//     { name: "Inventory", path: "/admin/inventory", icon: Boxes },

// ];

// export default function Sidebar() {
//   const pathname = usePathname();

//   return (
//     <div className="h-full flex flex-col bg-slate-900 text-gray-200">
//       {/* Logo */}
//       <div className="h-14 flex items-center px-6 border-b border-slate-700">
//         <span className="text-lg font-bold text-white">PhoolPatta</span>
//       </div>

//       {/* Links */}
//       <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
//         {menu.map((item) => {
//           const Icon = item.icon;
//           const active = pathname === item.path;

//           return (
//             <Link
//               key={item.path}
//               href={item.path}
//               className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition
//                 ${
//                   active
//                     ? "bg-slate-800 text-white"
//                     : "text-gray-300 hover:bg-slate-800 hover:text-white"
//                 }`}
//             >
//               <Icon size={18} />
//               {item.name}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Footer */}
//       <div className="px-6 py-4 text-xs text-gray-400 border-t border-slate-700">
//         © 2026 PhoolPatta
//       </div>
//     </div>
//   );
// }


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  TicketPercent,
  Boxes,
} from "lucide-react";

type SidebarProps = {
  closeSidebar?: () => void;
};

const menu = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
  { name: "Products", path: "/admin/products", icon: Package },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Coupons", path: "/admin/coupons", icon: TicketPercent },
  { name: "Inventory", path: "/admin/inventory", icon: Boxes },
];

export default function Sidebar({ closeSidebar }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col bg-slate-900 text-gray-200">
      {/* Logo */}
      <div className="h-14 flex items-center px-6 border-b border-slate-700">
        <span className="text-lg font-bold text-white">PhoolPatta</span>
      </div>

      {/* Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition
                ${
                  active
                    ? "bg-slate-800 text-white"
                    : "text-gray-300 hover:bg-slate-800 hover:text-white"
                }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 text-xs text-gray-400 border-t border-slate-700">
        © 2026 PhoolPatta
      </div>
    </div>
  );
}


