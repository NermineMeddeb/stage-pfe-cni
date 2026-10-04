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
           {
          id: '13',
          titre: 'Analyse des retours',
          icon: 'assets/icons/avis.png',
          url: 'tableau-de-bord',
        },
      ],
      active: false,
    },
    {
      id: '2',
      titre: 'paiements ',
      icon: 'assets/icons/paiements.png',
      url: '',
      sousMenu: [
        {
          id: '21',
          titre: 'Liste des paiements',
          icon: 'assets/icons/liste_paiements.png',
          url: 'paiements',
        },
        {
          id: '22',
          titre: 'Analyse Financière',
          icon: 'assets/icons/analyse-financiere.png',
          url: 'tableau-de-bord-finance',
        },
      ],
      active: false,
    },
    {
      id: '3',
      titre: 'Formations',
      icon: 'assets/icons/formations.png',
      url: 'formations',
      sousMenu: [
        {
          id: '31',
          titre: 'Liste des formations',
          icon: 'assets/icons/liste des formations.png',
          url: 'formations',
        },
        {
          id: '32',
          titre: 'Sessions',
          icon: 'assets/icons/session.png',
          url: 'sessions',
        },
        {
          id: '33',
          titre: 'Planning',
          icon: 'assets/icons/planning.png',
          url: 'calendrier',
        },
      ],
      active: false,
    },
    {
      id: '4',
      titre: 'Clients',
      icon: 'assets/icons/clients.png',
      url: '',
      sousMenu: [
        {
          id: '41',
          titre: 'Liste des clients',
          icon: 'assets/icons/clients.png',
          url: 'clients',
        },
        {
          id: '42',
          titre: 'Inscriptions',
          icon: 'assets/icons/clients.png',
          url: 'inscriptions',
        },
      ],
      active: false,
    },
    {
      id: '5',
      titre: 'Formateurs',
      icon: 'assets/icons/formateurs.png',
      url: '',
      sousMenu: [
        {
          id: '51',
          titre: 'Liste des formateurs',
          icon: 'assets/icons/liste_formateurs.png',
          url: 'formateurs',
        },
        {
          id: '52',
          titre: 'Planning',
          icon: 'assets/icons/planning.png',
          url: 'planning_formateurs',
        },
      ],
      active: false,
    },
    {
      id: '6',
      titre: 'Salles',
      icon: 'assets/icons/salles.png',
      url: 'salles',
      sousMenu: [
        {
          id: '61',
          titre: 'planning des salles',
          icon: 'assets/icons/planning.png',
          url: 'salles',
        },
      ],
      active: false,
    },
    {
      id: '7',
      titre: 'Certificats',
      icon: 'assets/icons/certificat.png',
      url: 'certificats',
      sousMenu: [
        {
          id: '71',
          titre: 'Générer certificat',
          icon: 'assets/icons/certificat.png',
          url: 'generer-certificats',
        },
        {
          id: '72',
          titre: 'Générer certificat automatiquement',
          icon: 'assets/icons/certificat.png',
          url: 'generer-certificats-auto',
        },
        {
          id: '73',
          titre: 'Historique',
          icon: 'assets/icons/historique.png',
          url: 'certificats',
        },
      ],
      active: false,
    },
    {
      id: '8',
      titre: 'Paramètres',
      icon: 'assets/icons/parametres.png',
      url: '',
      sousMenu: [
        {
          id: '81',
          titre: 'Employés',
          icon: 'assets/icons/employee.png',
          url: 'administrateurs',
        },
        {
          id: '82',
          titre: 'Thèmes',
          icon: 'assets/icons/themes.png',
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
  }
  toggleSidebar(): void {
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
