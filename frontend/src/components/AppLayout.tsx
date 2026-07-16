import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  FileCode2,
  Play,
  User,
  Settings,
  CalendarDays,
  Zap,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/authclient";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileCode2, label: "Submissions", href: "/submissions" },
  { icon: Play, label: "Playground", href: "/playground" },
  { icon: CalendarDays, label: "Daily Snippet", href: "/daily" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function AppLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>({ state: "loading", data: {} });

  useEffect(() => {
    (async () => {
      const data = await authClient.getSession();
      if (data !== null) {
        setProfile({ state: "authenticated", data });
      } else {
        setProfile({ state: "unauthenticated", data: {} });
      }
    })();
  }, []);

  const isAuthenticated = profile.state === "authenticated";
  const userImage = isAuthenticated && profile.data?.data?.user?.image ? profile.data.data.user.image : null;
  const userName = isAuthenticated && profile.data?.data?.user?.name ? profile.data.data.user.name : "User";
  const userEmail = isAuthenticated && profile.data?.data?.user?.email ? profile.data.data.user.email : "user@Beatcode.dev";

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-[100dvh] bg-[#F2F2F0] dark:bg-zinc-950 flex">
      {/* ─── Sidebar (Desktop) ─── */}
      <aside
        className={cn(
          "hidden md:flex flex-col w-[240px] border-r border-black/[0.06] dark:border-white/[0.06]",
          "bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl",
          "fixed inset-y-0 left-0 z-40"
        )}
      >
        {/* Logo */}
        <div className="px-5 py-5">
          <Link
            to="/"
            className="flex items-center gap-2.5 font-bold text-zinc-950 dark:text-zinc-50 text-[15px] tracking-tight"
          >
            <div className="flex items-center justify-center size-8 rounded-full bg-zinc-950 dark:bg-zinc-50">
              <Zap className="size-4 text-white dark:text-zinc-950" strokeWidth={2.5} />
            </div>
            Beatcode
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {navItems.map((item) => {
            const active = location.pathname === item.href || location.pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium",
                  "transition-all duration-300",
                  active
                    ? "bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                )}
                style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-black/[0.06] dark:border-white/[0.06]">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="size-8 overflow-hidden rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-white text-xs font-bold">
              {userImage ? (
                <img src={userImage} alt={userName} className="size-full object-cover" />
              ) : (
                <span>{userName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-zinc-950 dark:text-zinc-50 truncate">
                {userName}
              </p>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate font-mono">
                {userEmail}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-zinc-400"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Mobile top bar ─── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl border-b border-black/[0.06] dark:border-white/[0.06]">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-zinc-950 dark:text-zinc-50 text-[15px] tracking-tight"
        >
          <div className="flex items-center justify-center size-7 rounded-full bg-zinc-950 dark:bg-zinc-50">
            <Zap className="size-3.5 text-white dark:text-zinc-950" strokeWidth={2.5} />
          </div>
          Beatcode
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-zinc-600 dark:text-zinc-300"
        >
          {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* ─── Mobile sidebar overlay ─── */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-[260px] z-50 md:hidden bg-white dark:bg-zinc-900 border-r border-black/[0.06] dark:border-white/[0.06] flex flex-col">
            <div className="px-5 py-5">
              <Link
                to="/"
                className="flex items-center gap-2.5 font-bold text-zinc-950 dark:text-zinc-50 text-[15px] tracking-tight"
              >
                <div className="flex items-center justify-center size-8 rounded-full bg-zinc-950 dark:bg-zinc-50">
                  <Zap className="size-4 text-white dark:text-zinc-950" strokeWidth={2.5} />
                </div>
                Beatcode
              </Link>
            </div>
            <nav className="flex-1 px-3 py-2 space-y-0.5">
              {navItems.map((item) => {
                const active = location.pathname === item.href || location.pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium",
                      "transition-all duration-300",
                      active
                        ? "bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                    )}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </>
      )}

      {/* ─── Main content ─── */}
      <main className="flex-1 md:ml-[240px] min-h-[100dvh] pt-14 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
