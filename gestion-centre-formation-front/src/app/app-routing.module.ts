import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './Interfaces/accueil/accueil.component';
import { CatalogueComponent } from './Interfaces/catalogue/catalogue.component';
import { InscriptionComponent } from './Interfaces/inscription/inscription.component';
import { EspacePersonnelComponent } from './Interfaces/espace-personnel/espace-personnel.component';
import { FormationsComponent } from './Interfaces/formations/formations.component';
import { ClientsComponent } from './Interfaces/clients/clients.component';
import { FormateursComponent } from './Interfaces/formateurs/formateurs.component';
import { SallesComponent } from './Interfaces/salles/salles.component';
import { CertificatsComponent } from './Interfaces/certificats/certificats.component';
import { DashbordComponent } from './Interfaces/dashbord/dashbord.component';
import { CalendrierComponent } from './Interfaces/calendrier/calendrier.component';
import { ApercuProgrammeComponent } from './Interfaces/apercu-programme/apercu-programme.component';
import { MesFormationsComponent } from './Interfaces/mes-formations/mes-formations.component';
import { CommentairesComponent } from './Interfaces/commentaires/commentaires.component';
import { TableauDeBordComponent } from './Interfaces/tableau-de-bord/tableau-de-bord.component';
import { NouvelleFormationComponent } from './Interfaces/formations/nouvelle-formation/nouvelle-formation.component';
import { SessionsComponent } from './Interfaces/sessions/sessions.component';
import { PlanningFormateurComponent } from './Interfaces/planning-formateur/planning-formateur.component';
import { AdministrateursComponent } from './Interfaces/administrateurs/administrateurs.component';
import { NouvelleSessionComponent } from './Interfaces/sessions/nouvelle-session/nouvelle-session.component';
import { DetailsSupplimentaireClientComponent } from './Interfaces/clients/details-supplimentaire-client/details-supplimentaire-client.component';
import { NouveauClientComponent } from './Interfaces/clients/nouveau-client/nouveau-client.component';
const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Redirection vers le dashboard par défaut

  {
    path: 'dashboard',
    component: DashbordComponent,
    children: [
      { path: 'accueil', component: AccueilComponent },
      { path: 'catalogue', component: CatalogueComponent },
      { path: 'inscriptions', component: InscriptionComponent },
      { path: 'espace-personnel', component: EspacePersonnelComponent },
      { path: 'formations', component: FormationsComponent },
      { path: 'formations/:id/apercu', component: ApercuProgrammeComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'details-supplimentaire-client', component: DetailsSupplimentaireClientComponent },
      { path: 'nouveau-client', component: NouveauClientComponent },
      { path: 'formateurs', component: FormateursComponent },
      { path: 'salles', component: SallesComponent },
      { path: 'certificats', component: CertificatsComponent },
      { path: 'mes-formations', component: MesFormationsComponent },
      { path: 'tableau-de-bord', component: TableauDeBordComponent },
      { path: 'nouvelle-formation', component: NouvelleFormationComponent },
      { path: 'nouvelle-formation/:id', component: NouvelleFormationComponent },
      { path: 'sessions', component: SessionsComponent },
      { path: 'nouvelle-sessions/:id', component: NouvelleSessionComponent },
      { path: 'nouvelle-sessions', component: NouvelleSessionComponent },
     

      { path: 'planning_formateurs', component: PlanningFormateurComponent },
      { path: 'calandrier', component: CalendrierComponent },
      { path: 'administrateurs', component: AdministrateursComponent },

      {
        
        path: '',
        redirectTo: 'sessions',
        pathMatch: 'full',
      }, // Redirection interne par défaut vers Catalogue
    ],
  },

  { path: '**', redirectTo: 'sessions' }, // Gestion des erreurs
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
