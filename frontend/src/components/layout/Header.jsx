import { CheckSquare, Zap, LogOut, User } from "lucide-react";

const Header = ({
  totalTasks,
  completedTasks,
  username,
  onLogout,
}) => {
  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <header className="gradient-hero text-white shadow-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Taskify
              </h1>
              <p className="text-white/70 text-sm font-medium">
                Organize your work, amplify your focus
              </p>
            </div>
          </div>

          {/* Right: stats + user */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Stats */}
            <div className="flex items-center gap-5">
              <div className="text-center">
                <div className="text-xl font-bold">{totalTasks}</div>
                <div className="text-white/70 text-[11px] font-medium uppercase tracking-wide">
                  Total
                </div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <div className="text-xl font-bold">{completedTasks}</div>
                <div className="text-white/70 text-[11px] font-medium uppercase tracking-wide">
                  Done
                </div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <div className="text-xl font-bold">
                  {totalTasks - completedTasks}
                </div>
                <div className="text-white/70 text-[11px] font-medium uppercase tracking-wide">
                  Active
                </div>
              </div>

              {totalTasks > 0 && (
                <>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="flex items-center gap-2">
                    <div className="relative w-9 h-9">
                      <svg
                        className="w-9 h-9 -rotate-90"
                        viewBox="0 0 36 36"
                      >
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          fill="none"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="3"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          fill="none"
                          stroke="rgba(255,255,255,0.9)"
                          strokeWidth="3"
                          strokeDasharray={`${(progress / 100) * 94.2} 94.2`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white">
                        {progress}%
                      </span>
                    </div>
                    <div>
                      <div className="text-white/70 text-[11px] font-medium uppercase tracking-wide">
                        Progress
                      </div>
                      <div className="flex items-center gap-1 text-white/90 text-xs">
                        <Zap className="w-3 h-3" />
                        {progress === 100 ? "Complete!" : "In progress"}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User + logout */}
            <div className="w-px h-8 bg-white/20 hidden md:block" />
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white/15 rounded-lg px-3 py-1.5 border border-white/20">
                <User className="w-3.5 h-3.5 text-white/80" />
                <span className="text-sm font-medium text-white/90 max-w-[120px] truncate">
                  {username}
                </span>
              </div>
              <button
                onClick={onLogout}
                variant="ghost"
                size="icon"
                className="flex items-center justify-center w-8 h-8 text-white/70 hover:text-white hover:bg-white/15"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
