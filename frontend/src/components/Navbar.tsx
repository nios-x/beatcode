import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoaderCircle, Menu, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/authclient";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Community", href: "/#community" },
];


export function Navbar() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>({ state: "loading", data: {} });
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === "/";
  console.log(profile)
  useEffect(() => {
    (async () => {
      const data = await authClient.getSession();
      if (data.data !== null) {
        setProfile({ state: "authenticated", data });
      } else {
        setProfile({ state: "unauthenticated", data: {} });
      }
    })();
  }, []);

  const isLoading = profile.state === "loading";
  const isAuthenticated = profile.state === "authenticated";
  const userImage = profile.state === "authenticated" && profile.data?.data?.user?.image ? profile.data?.data?.user.image : null;
  const userName = profile.state === "authenticated" && profile.data?.data?.user?.name ? profile.data.data?.user.name : "User";
  const handleGetStarted = () => {
    if (isLoading) return;
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 px-4">
      <div
        className={cn(
          "flex items-center gap-1 rounded-full px-2 py-1.5",
          "bg-white/70 dark:bg-zinc-900/70",
          "backdrop-blur-2xl",
          "ring-1 ring-black/[0.06] dark:ring-white/[0.08]",
          "shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)]",
          "transition-all duration-700",
          "max-w-2xl w-full md:w-auto"
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 rounded-full px-3 py-1.5 font-bold text-zinc-950 dark:text-zinc-50 tracking-tight text-[15px]"
        >
          <div className="flex items-center justify-center size-7 rounded-full bg-zinc-950 dark:bg-zinc-50">
            <Zap className="size-3.5 text-white dark:text-zinc-950" strokeWidth={2.5} />
          </div>
          Beatcode
        </Link>

        {/* Desktop nav links */}
        {isLanding && (
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[13px] font-medium",
                  "text-zinc-500 dark:text-zinc-400",
                  "hover:text-zinc-950 dark:hover:text-zinc-50",
                  "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
                  "transition-colors duration-300"
                )}
                style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        <div className="flex-1 md:hidden" />

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-1 ml-1">
          <button
            type="button"
            onClick={() => !isAuthenticated && navigate("/login")}
            disabled={isLoading}
            className={cn(
              "flex items-center justify-center px-1.5 py-1.5 rounded-full text-[13px] font-medium",
              "text-zinc-600 dark:text-zinc-300",
              "hover:text-zinc-950 dark:hover:text-zinc-50",
              "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
              "transition-colors duration-300",
              isLoading && "cursor-wait"
            )}
          >
            {isLoading ? (
              <span className="flex items-center justify-center size-6 rounded-full bg-zinc-950 dark:bg-zinc-50">
                <LoaderCircle className="size-3.5 animate-spin text-white dark:text-zinc-950" />
              </span>
            ) : isAuthenticated ? (
              <div className="flex items-center justify-center size-8 overflow-hidden rounded-full bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950">
                {userImage ? (
                  <img
                    src={userImage}
                    alt={userName}
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="text-[11px] font-semibold">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            ) : (
              "Sign in"
            )}
          </button>
          <button
            type="button"
            onClick={handleGetStarted}
            disabled={isLoading}
            className={cn(
              "group flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full text-[13px] font-semibold",
              "bg-zinc-950 dark:bg-zinc-50",
              "text-white dark:text-zinc-950",
              "hover:opacity-90",
              "transition-all duration-300 active:scale-[0.98]",
              isLoading && "opacity-70"
            )}
            style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
          >
            Get Started
            <span
              className={cn(
                "flex items-center justify-center size-6 rounded-full",
                "bg-white/20 dark:bg-zinc-950/20",
                "transition-transform duration-300 group-hover:rotate-135 group-hover:scale-105"
              )}
              style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
            >
              →
            </span>
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex items-center justify-center size-8 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-zinc-600 dark:text-zinc-300"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className={cn(
            "fixed inset-x-4 top-[82px] z-50 rounded-[1.5rem] p-4",
            "bg-white/90 dark:bg-zinc-900/90",
            "backdrop-blur-2xl",
            "ring-1 ring-black/[0.06] dark:ring-white/[0.08]",
            "shadow-[0_8px_40px_-8px_rgba(0,0,0,0.08)]",
            "md:hidden"
          )}
        >
          <div className="flex flex-col gap-1">
            {isLanding &&
              navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-[15px] font-medium text-zinc-600 dark:text-zinc-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                >
                  {link.label}
                </a>
              ))}
            <div className="h-px bg-black/[0.06] dark:bg-white/[0.08] my-2" />
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                if (!isAuthenticated) navigate("/login");
              }}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl text-[15px] font-medium text-zinc-600 dark:text-zinc-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center size-6 rounded-full bg-zinc-950 dark:bg-zinc-50">
                  <LoaderCircle className="size-3.5 animate-spin text-white dark:text-zinc-950" />
                </span>
              ) : isAuthenticated ? (
                <div className="flex items-center justify-center size-8 overflow-hidden rounded-full bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950">
                  {userImage ? (
                    <img
                      src={userImage}
                      alt={userName}
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="text-[11px] font-semibold">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              ) : (
                "Sign in"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                handleGetStarted();
              }}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[15px] font-semibold bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950"
            >
              Get Started
              <span className="flex items-center justify-center size-5 rounded-full bg-white/20 dark:bg-zinc-950/20 text-xs">→</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
