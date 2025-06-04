import { SidebarTrigger } from "@/components/ui/sidebar";
import ProfileMenu from "./ProfileMenu";
import { Login } from "./Auth/LoginForm";

interface HeaderProps {
  user: Login;
  onLogout: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-8 w-8 bg-white/80 hover:bg-white border border-slate-200 shadow-sm" />
          <div>
            <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>
            {/* <p className="text-sm text-slate-500">Welcome back {user.fullName}</p> */}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ProfileMenu user={user} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
};

export default Header;
