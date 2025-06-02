export const dashboardKeys = {
  all: ["dashboard"] as const,

  get: () => [...dashboardKeys.all, "get-menu-data"] as const,
};
