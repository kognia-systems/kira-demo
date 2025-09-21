"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import ConfigMenuItem from "@/components/config-menu-item";
import {
  Workflow,
  Megaphone,
  Unplug,
  SlidersHorizontal,
  Cog,
} from "lucide-react";

const menuItems = [
  { key: "sources", label: "Fuentes", icon: Unplug },
  { key: "logic", label: "Lógica del agente", icon: Cog },
  { key: "chat", label: "Lineamientos", icon: SlidersHorizontal },
  { key: "channels", label: "Canales", icon: Megaphone },
];

export default function AvatarConfigLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const kiraId = params.id;

  return (
    <div className="flex h-full">
      <Sidebar
        collapsible="none"
        className="dark:bg-zinc-900/40 rounded-lg p-2"
      >
        <SidebarHeader>Configuración</SidebarHeader>
        <SidebarContent>
          <SidebarGroup />
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <a href={`/dashboard/kira/${kiraId}/${item.key}`}>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>

          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <main className="flex-1 px-4 overflow-y-auto">{children}</main>
    </div>
    // <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] h-screen">
    //   {/* Sidebar interno */}
    //   <aside className="bg-white border border-ai-muted/20 p-4 flex flex-col rounded-xl m-2">
    //     <h2 className="text-lg font-semibold mb-4 text-slate-700">
    //       Configuración del Agente
    //     </h2>
    //     <ul className="space-y-2">
    //       {menuItems.map((item) => (
    //         <li key={item.key}>
    //           <Link href={`/dashboard/kira/${kiraId}/${item.key}`}>
    //             <ConfigMenuItem
    //               label={item.label}
    //               icon={item.icon}
    //               active={pathname.includes(item.key)}
    //             />
    //           </Link>
    //         </li>
    //       ))}
    //     </ul>
    //   </aside>
    //   {/* Vista dinámica */}
    // </div>
  );
}
