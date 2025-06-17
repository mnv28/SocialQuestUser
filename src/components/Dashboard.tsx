import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import ContentArea from "@/components/ContentArea";
import Header from "@/components/Header";
import { Login } from "./Auth/LoginForm";
import { useGetMenuData } from "./Hooks/useGetMenuData";

interface DashboardProps {
  user: Login;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  console.log("user = = = 3", user);
  const [selectedContent, setSelectedContent] = useState<{
    title: string;
    url: string;
  } | null>(null);

  const { data: menuData } = useGetMenuData();

  const handleMenuItemClick = (title: string, url: string) => {
    setSelectedContent({ title, url });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-slate-100">
        <AppSidebar menuData={menuData} onMenuItemClick={handleMenuItemClick} />
        <SidebarInset>
          <Header user={user} onLogout={onLogout} />
          <ContentArea selectedContent={selectedContent} />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
