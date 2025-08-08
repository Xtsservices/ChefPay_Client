import { useState } from "react";
import {
  Home,
  UtensilsCrossed,
  FileBarChart,
  FileText,
  Settings,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

// navigation items with relevant icons
const navigationItems = [
  { title: "Dashboard", url: "/admin-dashboard", icon: Home },
  { title: "Restaurants", url: "/restaurants-admin", icon: UtensilsCrossed },
  { title: "Reports", url: "/admin-reports", icon: FileBarChart },
  // { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  // highlight if current path starts with item.url
  const isActive = (path: string) => currentPath.startsWith(path);

  const getNavCls = (active: boolean) =>
    active
      ? "bg-sidebar-accent text-sidebar-primary font-medium border-r-2 border-sidebar-primary"
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  return (
    <Sidebar className={`transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        {/* Logo + Title */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-bold text-sm">C</span>
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-semibold text-sidebar-foreground">ChefPay</h2>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {navigationItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${getNavCls(active)}`}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!collapsed && <span className="truncate">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Info */}
        {!collapsed && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
            {/* <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent/30">
              <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-medium">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">John Doe</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">john@example.com</p>
              </div>
            </div> */}
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}