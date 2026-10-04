import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './Interfaces/accueil/accueil.component';
import { CatalogueComponent } from './Interfaces/catalogue/catalogue.component';
import { InscriptionComponent } from './Interfaces Administrateurs/inscription/inscription.component';
import { EspacePersonnelComponent } from './Interfaces/espace-personnel/espace-personnel.component';
import { FormationsComponent } from './Interfaces Administrateurs/formations/formations.component';
import { ClientsComponent } from './Interfaces Administrateurs/clients/clients.component';
import { FormateursComponent } from './Interfaces Administrateurs/formateurs/formateurs.component';
import { SallesComponent } from './Interfaces Administrateurs/salles/salles.component';
import { CertificatsComponent } from './Interfaces Administrateurs/certificats/certificats.component';
import { CalendrierComponent } from './Interfaces Administrateurs/calendrier/calendrier.component';
import { ApercuProgrammeComponent } from './Interfaces/apercu-programme/apercu-programme.component';
import { MesFormationsComponent } from './Interfaces/mes-formations/mes-formations.component';
import { CommentairesComponent } from './Interfaces/commentaires/commentaires.component';
import { TableauDeBordComponent } from './Interfaces Administrateurs/tableau-de-bord/tableau-de-bord.component';
import { NouvelleFormationComponent } from './Interfaces Administrateurs/formations/nouvelle-formation/nouvelle-formation.component';
import { SessionsComponent } from './Interfaces Administrateurs/sessions/sessions.component';
import { PlanningFormateurComponent } from './Interfaces Administrateurs/planning-formateur/planning-formateur.component';
import { AdministrateursComponent } from './Interfaces Administrateurs/administrateurs/administrateurs.component';
import { NouvelleSessionComponent } from './Interfaces Administrateurs/sessions/nouvelle-session/nouvelle-session.component';
import { DetailsSupplimentaireClientComponent } from './Interfaces Administrateurs/clients/details-supplimentaire-client/details-supplimentaire-client.component';
import { NouveauClientComponent } from './Interfaces Administrateurs/clients/nouveau-client/nouveau-client.component';
import { TableauDeBordFormationsComponent } from './Interfaces Administrateurs/tableau-de-bord/tableau-de-bord-formations/tableau-de-bord-formations.component';
import { GenererCertificatsComponent } from './Interfaces Administrateurs/certificats/generer-certificats/generer-certificats.component';
import { DetailsSessionsComponent } from './Interfaces Administrateurs/sessions/details-sessions/details-sessions.component';
import { ThemesComponent } from './Interfaces Administrateurs/themes/themes.component';
import { EditSessionsComponent } from './Interfaces Administrateurs/sessions/edit-sessions/edit-sessions.component';
import { EditSalleComponent } from './Interfaces Administrateurs/salles/edit-salle/edit-salle.component';
import { NouvelleSessionsCalendrierComponent } from './Interfaces Administrateurs/calendrier/nouvelle-sessions-calendrier/nouvelle-sessions-calendrier.component';
import { ModifierSessionsCalendrierComponent } from './Interfaces Administrateurs/calendrier/modifier-sessions-calendrier/modifier-sessions-calendrier.component';
import { GenererCertificationAutoComponent } from './Interfaces Administrateurs/certificats/generer-certification-auto/generer-certification-auto.component';
import { PaiementsComponent } from './Interfaces Administrateurs/paiements/paiements.component';
import { NouvelleInscriptionComponent } from './Interfaces Administrateurs/inscription/nouvelle-inscription/nouvelle-inscription.component';
import { TableauDeBordFinanceComponent } from './tableau-de-bord-finance/tableau-de-bord-finance.component';
import { DetailsSupplimentaireFormateurComponent } from './Interfaces Administrateurs/formateurs/details-supplimentaire-formateur/details-supplimentaire-formateur.component';
import { NouveauFormateurComponent } from './Interfaces Administrateurs/formateurs/nouveau-formateur/nouveau-formateur.component';
import { DetailsSupplimentaireAdminComponent } from './Interfaces Administrateurs/administrateurs/details-supplimentaire-admin/details-supplimentaire-admin.component';
import { NouveauAdminComponent } from './Interfaces Administrateurs/administrateurs/nouveau-admin/nouveau-admin.component';
import { ProfilComponent } from './Interfaces/profil/profil.component';
import { LoginComponent } from './login/login.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { EtudiantLayoutComponent } from './layouts/etudiant-layout/etudiant-layout.component';
import { CalendrierClientComponent } from './Interfaces/calendrier-client/calendrier-client.component';
import { TableauDeBordClientComponent } from './Interfaces/tableau-de-bord-client/tableau-de-bord-client.component';
import { InscriptionClientComponent } from './Interfaces/inscription-client/inscription-client.component';
import { MesCertificationsComponent } from './Interfaces/mes-certifications/mes-certifications.component';
import { ChangerPwdComponent } from './Interfaces/profil/changer-pwd/changer-pwd.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AvisComponent } from './Interfaces/avis/avis.component';
import { NouveauPaiementComponent } from './Interfaces Administrateurs/paiements/nouveau-paiement/nouveau-paiement.component';
import { FeuilleDePresenceComponent } from './Interfaces Administrateurs/feuille-de-presence/feuille-de-presence.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'changer-le-pwd',
    component: ChangerPwdComponent,
  },
  { path: 'formations/:id/apercu', component: ApercuProgrammeComponent },

  {
    path: 'dashboard',
    component: AdminLayoutComponent, // Layout pour l'administration
    children: [
      { path: 'inscriptions', component: InscriptionComponent },
      {
        path: 'inscriptions/nouvelle-inscription',
        component: NouvelleInscriptionComponent,
      },
      {
        path: 'inscriptions/nouvelle-inscription/:id',
        component: NouvelleInscriptionComponent,
      },
      { path: 'formations', component: FormationsComponent },
      { path: 'clients', component: ClientsComponent },
      {
        path: 'clients/details-supplimentaire-client/:id',
        component: DetailsSupplimentaireClientComponent,
      },
      { path: 'clients/nouveau-client', component: NouveauClientComponent },
      { path: 'clients/nouveau-client/:id', component: NouveauClientComponent },
      { path: 'formateurs', component: FormateursComponent },
      { path: 'nouveau-formateur', component: NouveauFormateurComponent },
      { path: 'nouveau-formateur/:id', component: NouveauFormateurComponent },

      {
        path: 'formateurs/details-formateurs/:id',
        component: DetailsSupplimentaireFormateurComponent,
      },
      { path: 'salles', component: SallesComponent },
      { path: 'salles/edit-salle', component: EditSalleComponent },
      { path: 'salles/edit-salle/:id', component: EditSalleComponent },
      { path: 'certificats', component: CertificatsComponent },
      { path: 'generer-certificats', component: GenererCertificatsComponent },
      {
        path: 'generer-certificats-auto',
        component: GenererCertificationAutoComponent,
      },
      { path: 'tableau-de-bord', component: TableauDeBordComponent },
      { path: 'nouvelle-formation', component: NouvelleFormationComponent },
      { path: 'nouvelle-formation/:id', component: NouvelleFormationComponent },
      { path: 'sessions', component: SessionsComponent },
      { path: 'nouvelle-sessions/:id', component: NouvelleSessionComponent },
      { path: 'nouvelle-sessions', component: NouvelleSessionComponent },
      {
        path: 'sessions/details-sessions/:id',
        component: DetailsSessionsComponent,
      },
      {
        path: 'sessions/feuille de presnce',
        component: FeuilleDePresenceComponent,
      },
      { path: 'sessions/edit/:id', component: EditSessionsComponent },
      { path: 'planning_formateurs', component: PlanningFormateurComponent },
      { path: 'calendrier', component: CalendrierComponent },
      {
        path: 'calandrier/nouvelle-sessions',
        component: NouvelleSessionsCalendrierComponent,
      },
      {
        path: 'calandrier/update-sessions/:id',
        component: ModifierSessionsCalendrierComponent,
      },
      { path: 'administrateurs', component: AdministrateursComponent },
      { path: 'themes', component: ThemesComponent },
      {
        path: 'tableau-de-bord-formations',
        component: TableauDeBordFormationsComponent,
      },
      {
        path: 'tableau-de-bord-finance',
        component: TableauDeBordFinanceComponent,
      },
      { path: 'paiements', component: PaiementsComponent },
      { path: 'nouveau-paiements/:id', component: NouveauPaiementComponent },
      { path: 'nouveau-paiements', component: NouveauPaiementComponent },
      {
        path: 'nouveau-admin',
        component: NouveauAdminComponent,
      },
      {
        path: 'nouveau-admin/:id',
        component: NouveauAdminComponent,
      },
      {
        path: 'admin/details-admin/:id',
        component: DetailsSupplimentaireAdminComponent,
      },
      { path: 'profil', component: ProfilComponent },
      { path: '', redirectTo: 'sessions', pathMatch: 'full' },
    ],
  },

  {
    path: 'etudiant',
    component: EtudiantLayoutComponent, // Layout pour l'étudiant
    children: [
      { path: 'mes-formations', component: MesFormationsComponent },
      { path: 'calendrier-client', component: CalendrierClientComponent },
      {
        path: 'tableau-de-bord-client',
        component: TableauDeBordClientComponent,
      },
      { path: 'profil', component: ProfilComponent },
      { path: 'avis/:id', component: AvisComponent },

      { path: 'inscription-client/:id', component: InscriptionClientComponent },
      { path: 'accueil', component: AccueilComponent },
      { path: 'Mes-certifications', component: MesCertificationsComponent },
      { path: 'catalogue', component: CatalogueComponent },
      { path: 'espace-personnel', component: EspacePersonnelComponent },
      { path: '', redirectTo: 'catalogue', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: 'sessions' }, // Gestion des erreurs, redirige vers sessions
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
