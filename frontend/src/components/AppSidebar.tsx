import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  FileBarChart, 
  LogOut, 
  Bell,
  User,
  Zap,
  Gauge,
  BarChart3
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Connected Meters", url: "/meters", icon: Gauge },
  { title: "Reports", url: "/reports", icon: FileBarChart },
  { title: "Users", url: "/users", icon: Users, adminOnly: true },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sidebar className={`${open ? "w-56" : "w-14"} transition-all duration-300`}>
      <SidebarHeader className="p-2">
        {open && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.profileImage} />
                <AvatarFallback className="bg-gradient-primary text-white text-xs">
                  {user?.username?.substring(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-xs truncate">{user?.username}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <Separator />
          </>
        )}
        {!open && (
          <Avatar className="w-7 h-7 mx-auto">
            <AvatarImage src={user?.profileImage} />
            <AvatarFallback className="bg-gradient-primary text-white text-[10px]">
              {user?.username?.substring(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                // Hide admin-only items for non-admin users
                if (item.adminOnly && !isAdmin()) return null;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <NavLink
                      to={item.url!}
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-energy-primary/25 via-energy-primary/15 to-transparent text-energy-primary font-bold border-l-4 border-energy-primary shadow-lg dark:from-energy-accent/35 dark:via-energy-accent/20 dark:to-transparent dark:text-energy-accent dark:border-energy-accent dark:shadow-glow backdrop-blur-sm scale-[1.02]"
                            : "hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground hover:shadow-sm hover:translate-x-1"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className={`h-4 w-4 transition-all ${isActive ? 'drop-shadow-md scale-110' : ''}`} />
                          {open && <span className="font-medium text-sm">{item.title}</span>}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Separator and Logout */}
        <div className="px-2 mt-3">
          <Separator />
          <div className="mt-2">
            {open && (
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 text-destructive border-destructive/20 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/40 text-sm py-2"
                onClick={handleLogout}
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </Button>
            )}
            {!open && (
              <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full hover:bg-destructive/5 p-1.5">
                <LogOut className="h-3.5 w-3.5 text-destructive" />
              </Button>
            )}
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-border/50">
        {open && (
          <div className="text-center space-y-2">
            <img 
              src="/SEI_Logo.png" 
              alt="Smart Energy Intelligence" 
              className="h-12 mx-auto object-contain"
            />
            <p className="text-xs font-bold text-energy-primary">
              Smart Energy Intelligence
            </p>
            <p className="text-[10px] text-muted-foreground font-medium">
              Powered by{" "}
              <span className="text-energy-primary font-semibold">CubeAI Solutions</span>
            </p>
          </div>
        )}
        {!open && (
          <div className="flex items-center justify-center">
            <img 
              src="/SEI_Logo.png" 
              alt="SEI" 
              className="h-8 object-contain"
            />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}