import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from './menu';

@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.css'],
})
export class SidebarAdminComponent implements OnInit {
  public menuProperties: Array<Menu> = [
    {
      id: '1',
      titre: 'Tableau de bord',
      icon: 'assets/icons/dashbord.png',
      url: 'tableau-de-bord',
      sousMenu: [
        {
          id: '12',
          titre: 'Tableau de bord des formations',
          icon: 'assets/icons/liste des formations.png',
          url: 'tableau-de-bord-formations',
        },
             ],      active: false,
    },
    {
      id: '2',
      titre: 'Formations',
      icon: 'assets/icons/formations.png',
      url: 'formations',
      sousMenu: [
        {
          id: '21',
          titre: 'Liste des formations',
          icon: 'assets/icons/liste des formations.png',
          url: 'formations',
        },
        {
          id: '22',
          titre: 'Sessions',
          icon: 'assets/icons/session.png',
          url: 'sessions',
        },
        {
          id: '23',
          titre: 'Planning',
          icon: 'assets/icons/planning.png',
          url: 'calandrier',
        },
      ],
      active: false,
    },
    {
      id: '3',
      titre: 'Clients',
      icon: 'assets/icons/clients.png',
      url: '',
      sousMenu: [
        {
          id: '31',
          titre: 'Liste des clients',
          icon: 'assets/icons/clients.png',
          url: 'clients',
        },
        {
          id: '32',
          titre: 'Inscriptions',
          icon: 'assets/icons/clients.png',
          url: 'inscriptions',
        },
      ],
      active: false,
    },
    {
      id: '4',
      titre: 'Formateurs',
      icon: 'assets/icons/formateurs.png',
      url: '',
      sousMenu: [
        {
          id: '41',
          titre: 'Liste des formateurs',
          icon: 'assets/icons/liste_formateurs.png',
          url: 'formateurs',
        },
        {
          id: '42',
          titre: 'Planning',
          icon: 'assets/icons/planning.png',
          url: 'planning_formateurs',
        },
      ],
      active: false,
    },
    {
      id: '5',
      titre: 'Salles',
      icon: 'assets/icons/salles.png',
      url: 'salles',
      sousMenu: [
        {
          id: '51',
          titre: 'planning des salles',
          icon: 'assets/icons/planning.png',
          url: 'salles',
        },
      ],
      active: false,
    },
    {
      id: '6',
      titre: 'Certificats',
      icon: 'assets/icons/certificat.png',
      url: 'certificats',
      sousMenu: [
        {
          id: '61',
          titre: 'Générer certificat',
          icon: 'assets/icons/certificat.png',
          url: 'generer-certificats',
        },
        {
          id: '62',
          titre: 'Historique',
          icon: 'assets/icons/historique.png',
          url: 'certificats',
        },
      ],
      active: false,
    },
    {
      id: '7',
      titre: 'Paramètres',
      icon: 'assets/icons/parametres.png',
      url: '',
      sousMenu: [
        {
          id: '71',
          titre: 'Administrateurs',
          icon: 'fas fa-users-cog',
          url: 'administrateurs',
        },
        {
          id: '72',
          titre: 'Thèmes',
          icon: 'fas fa-tags',
          url: 'themes',
        },
      ],
      active: false,
    },
  ];
  public sidebarCollapsed = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Set active menu based on current route
    const currentUrl = this.router.url;
    this.setActiveMenu(currentUrl);
  } toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  setActiveMenu(url: string): void {
    this.menuProperties.forEach((menu) => {
      menu.active = false;
      if (menu.sousMenu && menu.sousMenu.length > 0) {
        menu.sousMenu.forEach((sousMenu) => {
          if (url.includes(sousMenu.url)) {
            menu.active = true;
            sousMenu.active = true;
          }
        });
      } else if (menu.url && url.includes(menu.url)) {
        // Added null check for menu.url
        menu.active = true;
      }
    });
  }

  toggleMenu(menu: Menu): void {
    // Close other menus
    this.menuProperties.forEach((m) => {
      if (m.id !== menu.id) {
        m.active = false;
      }
    });
    menu.active = !menu.active;
  }

  navigate(sousMenu: any): void {
    // Reset all active states
    this.menuProperties.forEach((menu) => {
      if (menu.sousMenu) {
        menu.sousMenu.forEach((sm) => {
          sm.active = sm.id === sousMenu.id;
        });
      }
    });

    if (sousMenu.url) {
      this.router.navigate(['/dashboard', sousMenu.url]);
    }
  }
}
