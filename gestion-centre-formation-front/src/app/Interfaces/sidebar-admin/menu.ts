export interface Menu {
  id: string;
  titre: string;
  icon: string;
  url?: string;  // url is optional
  active: boolean;
  sousMenu?: Array<{
    id: string;
    titre: string;
    icon: string;
    url: string;
    active?: boolean;
  }>;
}