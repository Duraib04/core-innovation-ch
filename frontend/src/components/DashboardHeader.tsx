import { Clock, Moon, Sun, Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { useMeterData } from "@/hooks/useMeterData";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationSidebar } from "@/components/NotificationSidebar";
import { useState } from "react";

export function DashboardHeader() {
  const { meters, lastUpdate } = useMeterData();
  const { theme, setTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const { open, toggleSidebar } = useSidebar();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Count active meters
  const activeMeters = meters.filter(meter => meter.status === 'online').length;

  return (
    <header className="bg-white/95 dark:bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-lg pl-2 pr-2 sm:pr-3 lg:pr-4 py-1 sm:py-1.5 lg:py-2 sticky top-0 z-50 transition-colors duration-300">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="hover:bg-energy-secondary/10 transition-colors rounded-lg border border-border/50 shadow-sm p-1"
          >
            {open ? (
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-energy-primary dark:text-energy-accent" />
            ) : (
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-energy-primary dark:text-energy-accent" />
            )}
          </Button>
          <div>
            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-energy-primary">
              Smart Energy Intelligence
            </h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Monitor | Analyze | Optimize</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs lg:text-sm text-muted-foreground">
            <span className="font-medium whitespace-nowrap">Connected Meters: {activeMeters}</span>
          </div>
          
          <div className="flex flex-col gap-0.5 text-[10px] sm:text-xs lg:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="font-medium whitespace-nowrap">Last Update: {lastUpdate.toLocaleDateString()} {lastUpdate.toLocaleTimeString()}</span>
            </div>
            <div className="text-[9px] sm:text-[10px] text-muted-foreground/80 ml-3.5 sm:ml-4">
              Data updates every 30 secs
            </div>
          </div>
          
          <Button
            variant="ghost" 
            size="sm" 
            onClick={() => setIsNotificationOpen(true)}
            className="relative hover:bg-energy-secondary/10 transition-colors p-1 sm:p-2"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-energy-primary dark:text-energy-accent" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-energy-danger text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hover:bg-energy-secondary/10 transition-colors p-1 sm:p-2"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-energy-accent" />
            ) : (
              <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-energy-primary" />
            )}
          </Button>
        </div>
      </div>
      
      <NotificationSidebar 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
    </header>
  );
}