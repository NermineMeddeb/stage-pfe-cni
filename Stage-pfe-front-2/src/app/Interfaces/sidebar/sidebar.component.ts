import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from './menu';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  public menuPropertiesEtudiant: Array<Menu> = [
    {
      id: 'e1',
      titre: 'Tableau de bord',
      icon: 'assets/icons/dashbord.png',
      url: 'tableau-de-bord-client',
      sousMenu: [],
      active: false, // Explicitly set to false
    },
    {
      id: 'e2',
      titre: 'Catalogue',
      icon: 'assets/icons/formations.png',
      url: 'catalogue',

      active: false,
    },
    {
      id: 'e3',
      titre: 'Mes formations',
      icon: 'assets/icons/liste des formations.png',
      url: 'mes-formations',
      sousMenu: [],
      active: false,
    },
    {
      id: 'e4',
      titre: 'Calendrier',
      icon: 'assets/icons/planning.png',
      url: 'calendrier-client',
      sousMenu: [],
      active: false,
    },
    {
      id: 'e5',
      titre: 'Mes certifications',
      icon: 'assets/icons/historique.png',
      url: 'Mes-certifications',
      sousMenu: [],
      active: false,
    },
  ];

  // Add another menu property for non-student section
  public menuPropertiesAdmin: Array<Menu> = [
    // Add admin menu items as needed
    {
      id: 'a1',
      titre: 'Administration',
      icon: 'assets/icons/admin.png',
      url: 'admin',
      sousMenu: [],
      active: false,
    },
  ];

  public sidebarCollapsed = false;
  public isEtudiantSection = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const currentUrl = this.router.url;
    this.isEtudiantSection = currentUrl.includes('/etudiant');
    this.setActiveMenu(currentUrl);
  }

  // Fixed the recursive call in the getter
  get menuProperties(): Array<Menu> {
    return this.isEtudiantSection
      ? this.menuPropertiesEtudiant
      : this.menuPropertiesAdmin;
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  setActiveMenu(url: string): void {
    const menus = this.menuProperties;
    menus.forEach((menu) => {
      menu.active = false;
      if (menu.sousMenu && menu.sousMenu.length > 0) {
        menu.sousMenu.forEach((sousMenu) => {
          sousMenu.active = url.includes(sousMenu.url);
          if (sousMenu.active) {
            menu.active = true;
          }
        });
      } else if (menu.url && url.includes(menu.url)) {
        menu.active = true;
      }
    });
  }

  toggleMenu(menu: Menu): void {
    if (menu.sousMenu && menu.sousMenu.length > 0) {
      menu.active = !menu.active;
    } else {
      this.navigate(menu);
    }
  }

  navigate(menu: Menu): void {
    const menus = this.menuProperties;
    console.log('Navigating to:', menu.url);
    console.log('Is student section:', this.isEtudiantSection);
    const basePath = this.isEtudiantSection ? '/etudiant' : '/dashboard';
    console.log('Full path:', `${basePath}/${menu.url}`);

    menus.forEach((m) => {
      if (m.sousMenu) {
        m.sousMenu.forEach((sm) => {
          sm.active = false;
        });
      }
      m.active = false;
    });

    menu.active = true;

    this.router.navigate([basePath, menu.url]);
  }
}
