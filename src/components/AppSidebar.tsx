import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Sidebar, SidebarContent, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface MenuItem {
  id: number;
  title: string;
  url: string;
}

interface MenuGroup {
  id: number;
  title: string;
  items: MenuItem[];
}

interface AppSidebarProps {
  menuData: MenuGroup[];
  onMenuItemClick: (title: string, url: string) => void;
}

const AppSidebar = ({ menuData, onMenuItemClick }: AppSidebarProps) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [expandedGroups, setExpandedGroups] = useState<number[]>([1]);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const toggleGroup = (groupId: number) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item.id);
    onMenuItemClick(item.title, item.url);
  };

  return (
    <Sidebar className="bg-white border-r border-slate-200/50 shadow-lg">
      <div className="p-4 border-b border-slate-200/50">
        <div className="flex items-center gap-3">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <img src="/logo.webp" alt="Logo" className="h-8 w-auto cursor-pointer" />
              {/* <p className="text-xs text-slate-500">Dashboard Portal</p> */}
            </div>
          )}
        </div>
      </div>

      <SidebarContent>
        <div className="space-y-2">
          {menuData.map((group) => {
            const isExpanded = expandedGroups.includes(group.id);

            const isExpandable = !!group.items.length;

            return (
              <div key={group.id} className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto p-3 hover:bg-slate-100"
                  onClick={() => !isCollapsed && toggleGroup(group.id)}
                >
                  {!isCollapsed && (
                    <>
                      <span className="text-sm font-medium text-slate-700 flex-1 text-left">
                        {group.title}
                      </span>

                      {isExpandable && (
                        <>
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          )}
                        </>
                      )}
                    </>
                  )}
                </Button>

                {isExpanded && !isCollapsed && (
                  <div className="ml-6 space-y-1 border-l border-slate-200 pl-4">
                    {group.items.map((item) => (
                      <Button
                        key={item.id}
                        variant="ghost"
                        className={`w-full justify-start h-auto p-2 text-left hover:bg-blue-50 transition-colors ${
                          selectedItem === item.id
                            ? "bg-blue-50 text-orange-700 border-l-2 border-orange-500"
                            : "text-slate-600"
                        }`}
                        onClick={() => handleItemClick(item)}
                      >
                        <span className="text-sm">{item.title}</span>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
