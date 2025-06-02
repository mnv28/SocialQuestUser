import { MENU_DATA_ROUTE } from "@/constants/routes";
import { dashboardKeys } from "@/keyFactories/dashboardKeys";
import { useAxios } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

type MenuItem = {
  id: number;
  title: string;
  url: string;
};

type MenuSection = {
  id: number;
  title: string;
  items: MenuItem[];
};

export function useGetMenuData() {
  const { axiosInstance } = useAxios();

  const getMenuList = async () => {
    const { data } = await axiosInstance.get<{
      success: boolean;
      data: MenuSection[];
    }>(MENU_DATA_ROUTE);

    return data.data;
  };

  return useQuery({
    queryKey: dashboardKeys.get(),
    queryFn: getMenuList,
    initialData: [],
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    enabled: true,
    gcTime: 1000,
  });
}
