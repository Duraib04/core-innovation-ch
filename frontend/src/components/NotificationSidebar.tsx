import { X, Bell, AlertTriangle, CheckCircle, Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";

interface NotificationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationSidebar({ isOpen, onClose }: NotificationSidebarProps) {
  const { notifications, removeNotification, clearAllNotifications, markAsRead } = useNotifications();

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  // Only render when sidebar should be open
  if (!isOpen) return null;

  return (
    <>
      {/* Semi-transparent overlay covering full viewport */}
      <div 
        className="fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300 ease-in-out opacity-100"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 right-0 h-screen w-[350px] max-w-[90%] bg-background border-l border-border z-[9999] shadow-lg",
        "flex flex-col transition-transform duration-300 ease-in-out animate-slide-in-right"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-background">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                className="text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 px-2 py-1 h-auto"
              >
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-muted/50 rounded-full h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground px-6">
              <Bell className="h-12 w-12 mb-4 opacity-30" />
              <p className="text-sm text-center">No notifications</p>
            </div>
          ) : (
            <div className="space-y-3 p-6">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "relative p-4 rounded-lg border transition-all duration-200 cursor-pointer group hover:shadow-sm",
                    notification.read 
                      ? "bg-muted/20 border-border/30 hover:bg-muted/30" 
                      : "bg-card border-border hover:bg-muted/40 shadow-sm"
                  )}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3 pr-8">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        "text-sm font-medium mb-1 leading-tight",
                        notification.read ? "text-muted-foreground" : "text-foreground"
                      )}>
                        {notification.title}
                      </h3>
                      <p className={cn(
                        "text-xs mb-2 leading-relaxed",
                        notification.read ? "text-muted-foreground/80" : "text-muted-foreground"
                      )}>
                        {notification.message}
                      </p>
                      <span className="text-xs text-muted-foreground/60">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Individual dismiss button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-6 w-6 p-0 hover:bg-muted/60 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  
                  {/* Unread indicator */}
                  {!notification.read && (
                    <div className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}