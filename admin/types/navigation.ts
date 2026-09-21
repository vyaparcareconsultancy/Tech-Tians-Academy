export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string | number;
  exact?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}
