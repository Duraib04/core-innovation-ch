import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Palette, Bell, Shield, Download, Moon } from "lucide-react";

const Settings = () => {
  return (
    <div className="p-2 sm:p-2 lg:p-3 space-y-3 sm:space-y-4 lg:space-y-3">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-energy-primary">Theme Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Customize your dashboard appearance and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theme Configuration */}
        <Card className="p-6 rounded-2xl bg-gradient-card shadow-card backdrop-blur-sm border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-energy-primary">Theme Configuration</h3>
              <p className="text-sm text-muted-foreground">Customize visual appearance</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="color-scheme" className="text-sm font-medium">Color Scheme</Label>
              <Select defaultValue="blue">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Blue (Default)</SelectItem>
                  <SelectItem value="green">Green Energy</SelectItem>
                  <SelectItem value="purple">Purple Tech</SelectItem>
                  <SelectItem value="orange">Orange Solar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="text-sm font-medium">Dark Mode</Label>
              <Switch id="dark-mode" />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="animations" className="text-sm font-medium">Enable Animations</Label>
              <Switch id="animations" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="glassmorphism" className="text-sm font-medium">Glassmorphism Effects</Label>
              <Switch id="glassmorphism" defaultChecked />
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6 rounded-2xl bg-gradient-card shadow-card backdrop-blur-sm border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-energy-primary">Notifications</h3>
              <p className="text-sm text-muted-foreground">Configure alert preferences</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="voltage-alerts" className="text-sm font-medium">Voltage Sag Alerts</Label>
              <Switch id="voltage-alerts" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="overload-alerts" className="text-sm font-medium">Overload Warnings</Label>
              <Switch id="overload-alerts" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="offline-alerts" className="text-sm font-medium">Device Offline Alerts</Label>
              <Switch id="offline-alerts" defaultChecked />
            </div>

            <div className="space-y-3">
              <Label htmlFor="alert-threshold" className="text-sm font-medium">Load Alert Threshold</Label>
              <Select defaultValue="80">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="70">70%</SelectItem>
                  <SelectItem value="80">80%</SelectItem>
                  <SelectItem value="90">90%</SelectItem>
                  <SelectItem value="95">95%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-6 rounded-2xl bg-gradient-card shadow-card backdrop-blur-sm border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-success flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-energy-primary">Security</h3>
              <p className="text-sm text-muted-foreground">Account security settings</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="two-factor" className="text-sm font-medium">Two-Factor Authentication</Label>
              <Switch id="two-factor" />
            </div>

            <div className="space-y-3">
              <Label htmlFor="session-timeout" className="text-sm font-medium">Session Timeout</Label>
              <Select defaultValue="60">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="480">8 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="w-full">
              Change Password
            </Button>
          </div>
        </Card>

        {/* Data & Export Settings */}
        <Card className="p-6 rounded-2xl bg-gradient-card shadow-card backdrop-blur-sm border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-energy-secondary/20 flex items-center justify-center">
              <Download className="h-5 w-5 text-energy-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-energy-primary">Data & Export</h3>
              <p className="text-sm text-muted-foreground">Data management preferences</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="data-retention" className="text-sm font-medium">Data Retention Period</Label>
              <Select defaultValue="365">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">6 months</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="730">2 years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="export-format" className="text-sm font-medium">Default Export Format</Label>
              <Select defaultValue="excel">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-backup" className="text-sm font-medium">Automatic Data Backup</Label>
              <Switch id="auto-backup" defaultChecked />
            </div>
          </div>
        </Card>
      </div>

      <Separator />

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Changes are saved automatically
        </p>
        <div className="flex gap-3">
          <Button variant="outline">Reset to Defaults</Button>
          <Button className="bg-gradient-primary text-white shadow-metric hover:shadow-glow">
            Apply Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;