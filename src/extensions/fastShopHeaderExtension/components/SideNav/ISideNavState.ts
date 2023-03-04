import ISideNavItem from "./model/ISideNavItem";

export default interface ISideNavState {
  siteNavItems: ISideNavItem[];
  isOpened: boolean;
  showDialog?: boolean;
  searchText: string;
}
