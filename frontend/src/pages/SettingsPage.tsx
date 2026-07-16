import { useState } from "react";
import { User, Bell, Shield, Palette, Globe, Save, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProfile, updateSettings } from "@/lib/api";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "language", label: "Language", icon: Globe },
  { id: "security", label: "Security", icon: Shield },
];

function BezelCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-[2rem] p-1.5 ring-1 ring-black/[0.05] dark:ring-white/[0.06] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] bg-white/50 dark:bg-zinc-800/30", className)}>
      <div className="h-full rounded-[calc(2rem-0.375rem)] bg-white dark:bg-zinc-900 p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative inline-flex h-6 w-10 rounded-full transition-colors duration-300",
        enabled ? "bg-violet-500" : "bg-zinc-200 dark:bg-zinc-700"
      )}
      style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform duration-300",
          enabled && "translate-x-4"
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
      />
    </button>
  );
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  
  // Local states for UI preferences (would normally be saved to local storage)
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [defaultLang, setDefaultLang] = useState(() => localStorage.getItem("beatcode_default_lang") || "node");
  const [notifications, setNotifications] = useState({
    email: true,
    matchResults: true,
    dailyChallenge: true,
    weeklyReport: false,
    marketing: false,
  });

  const queryClient = useQueryClient();
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setSavedState(true);
      setTimeout(() => setSavedState(false), 2000);
    },
  });

  // Form state
  const [name, setName] = useState("");
  const [savedState, setSavedState] = useState(false);
  const profileName = profileData?.user?.name ?? "";

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() !== profileName) {
      updateSettingsMutation.mutate({ name });
    }
  };

  return (
    <div className="px-6 py-8 md:px-10 md:py-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <span className="inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mb-2">
          Settings
        </span>
        <h1
          className="font-bold text-zinc-950 dark:text-zinc-50 tracking-tight"
          style={{ fontSize: "clamp(24px, 3vw, 36px)", letterSpacing: "-0.03em", lineHeight: "1.1" }}
        >
          Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
        {/* Tab sidebar */}
        <div className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium whitespace-nowrap",
                "transition-all duration-300",
                activeTab === tab.id
                  ? "bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              )}
              style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
            >
              <tab.icon className="size-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {/* Profile */}
          {activeTab === "profile" && (
            <BezelCard>
              <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 tracking-tight mb-1">Profile Settings</h2>
              <p className="text-[13px] text-zinc-400 dark:text-zinc-500 mb-6">Manage your public profile information.</p>

              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="size-6 text-violet-500 animate-spin" />
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[13px] font-medium text-zinc-600 dark:text-zinc-300">Full Name</Label>
                      <Input 
                        value={name || profileName}
                        onChange={(e) => setName(e.target.value)}
                        className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-0 ring-1 ring-black/[0.06] dark:ring-white/[0.08] text-[14px]" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[13px] font-medium text-zinc-600 dark:text-zinc-300">Email Address (Cannot be changed)</Label>
                      <Input 
                        disabled
                        value={profileData?.user?.email ?? ""} 
                        className="h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border-0 ring-1 ring-black/[0.06] dark:ring-white/[0.08] text-[14px] text-zinc-500" 
                      />
                    </div>
                  </div>

                  <Separator />

                  <button
                    type="submit"
                    disabled={updateSettingsMutation.isPending || name.trim() === profileName}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold",
                      "bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950",
                      "active:scale-[0.99] transition-all duration-300 disabled:opacity-50"
                    )}
                  >
                    {updateSettingsMutation.isPending ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : savedState ? (
                      <Check className="size-3.5 text-emerald-500" />
                    ) : (
                      <Save className="size-3.5" />
                    )}
                    {savedState ? "Saved!" : "Save Changes"}
                  </button>
                </form>
              )}
            </BezelCard>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <BezelCard>
              <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 tracking-tight mb-1">Notifications</h2>
              <p className="text-[13px] text-zinc-400 dark:text-zinc-500 mb-6">Choose what you'd like to be notified about.</p>

              <div className="space-y-4">
                {[
                  { key: "email" as const, title: "Email Notifications", desc: "Receive notifications via email" },
                  { key: "matchResults" as const, title: "Match Results", desc: "Get notified when your match results are in" },
                  { key: "dailyChallenge" as const, title: "Daily Challenge Reminder", desc: "Reminder for the daily coding challenge" },
                  { key: "weeklyReport" as const, title: "Weekly Progress Report", desc: "Summary of your weekly activity" },
                  { key: "marketing" as const, title: "Marketing Emails", desc: "Product updates and promotional content" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-[14px] font-medium text-zinc-950 dark:text-zinc-50">{item.title}</p>
                      <p className="text-[12px] text-zinc-400 dark:text-zinc-500">{item.desc}</p>
                    </div>
                    <ToggleSwitch
                      enabled={notifications[item.key]}
                      onChange={(v) => setNotifications({ ...notifications, [item.key]: v })}
                    />
                  </div>
                ))}
              </div>
            </BezelCard>
          )}

          {/* Appearance */}
          {activeTab === "appearance" && (
            <BezelCard>
              <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 tracking-tight mb-1">Appearance</h2>
              <p className="text-[13px] text-zinc-400 dark:text-zinc-500 mb-6">Customize how Beatcode looks for you.</p>

              <div className="space-y-4">
                <h3 className="text-[13px] font-medium text-zinc-600 dark:text-zinc-300">Theme</h3>
                <div className="grid grid-cols-3 gap-3">
                  {(["light", "dark", "system"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl ring-1 transition-all duration-200",
                        theme === t
                          ? "ring-violet-500 bg-violet-50/50 dark:bg-violet-500/10"
                          : "ring-black/[0.06] dark:ring-white/[0.08] hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      )}
                    >
                      <div className={cn(
                        "size-10 rounded-xl",
                        t === "light" ? "bg-white ring-1 ring-zinc-200" :
                        t === "dark" ? "bg-zinc-900 ring-1 ring-zinc-700" :
                        "bg-gradient-to-br from-white to-zinc-900 ring-1 ring-zinc-400"
                      )} />
                      <span className="text-[12px] font-medium text-zinc-600 dark:text-zinc-300 capitalize">{t}</span>
                    </button>
                  ))}
                </div>
              </div>
            </BezelCard>
          )}

          {/* Language */}
          {activeTab === "language" && (
            <BezelCard>
              <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 tracking-tight mb-1">Default Language</h2>
              <p className="text-[13px] text-zinc-400 dark:text-zinc-500 mb-6">Set your preferred programming language for the playground.</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["node", "python"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setDefaultLang(lang);
                      localStorage.setItem("beatcode_default_lang", lang);
                    }}
                    className={cn(
                      "px-4 py-3 rounded-xl text-[13px] font-medium ring-1 transition-all duration-200 capitalize",
                      defaultLang === lang
                        ? "ring-violet-500 bg-violet-50/50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400"
                        : "ring-black/[0.06] dark:ring-white/[0.08] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    )}
                  >
                    {lang === "node" ? "Node.js" : "Python"}
                  </button>
                ))}
              </div>
            </BezelCard>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <BezelCard>
              <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 tracking-tight mb-1">Security</h2>
              <p className="text-[13px] text-zinc-400 dark:text-zinc-500 mb-6">Manage your account security.</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[14px] font-medium text-zinc-950 dark:text-zinc-50 mb-1">Delete Account</h3>
                  <p className="text-[12px] text-zinc-400 dark:text-zinc-500 mb-3">Permanently delete your account and all data. This action cannot be undone.</p>
                  <button className="px-4 py-2 rounded-xl text-[13px] font-medium text-red-500 ring-1 ring-red-200 dark:ring-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-200">
                    Delete Account
                  </button>
                </div>
              </div>
            </BezelCard>
          )}
        </div>
      </div>
    </div>
  );
}
