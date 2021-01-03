export const parseProviders = (
  groupedRoutes: any[],
  name
): { name: string; providers: string[]; reversed: string[] } => {
  const providers = groupedRoutes.map((route) => route.moduleName);
  const reversed = [...providers];
  return {
    providers,
    reversed: reversed.reverse(),
    name,
  };
};
