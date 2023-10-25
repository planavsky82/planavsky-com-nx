export type Navigation = NavigationItem[];
export interface NavigationItem {
  route: string;
  name: string;
  icon?: string;
  secure: boolean;
}
