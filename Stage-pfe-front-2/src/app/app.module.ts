import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccueilComponent } from './Interfaces/accueil/accueil.component';
import { CatalogueComponent } from './Interfaces/catalogue/catalogue.component';
import { InscriptionComponent } from './Interfaces Administrateurs/inscription/inscription.component';
import { EspacePersonnelComponent } from './Interfaces/espace-personnel/espace-personnel.component';
import { FormationsComponent } from './Interfaces Administrateurs/formations/formations.component';
import { ClientsComponent } from './Interfaces Administrateurs/clients/clients.component';
import { FormateursComponent } from './Interfaces Administrateurs/formateurs/formateurs.component';
import { SallesComponent } from './Interfaces Administrateurs/salles/salles.component';
import { CertificatsComponent } from './Interfaces Administrateurs/certificats/certificats.component';
import { HeaderComponent } from './Interfaces/header/header.component';
import { SidebarComponent } from './Interfaces/sidebar/sidebar.component';
import { ModalDeConfirmationComponent } from './Interfaces/modal-de-confirmation/modal-de-confirmation.component';
import { NotificationComponent } from './Interfaces/notification/notification.component';
import { PaginationComponent } from './Interfaces Administrateurs/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './Interfaces/footer/footer.component';
import { CalendrierComponent } from './Interfaces Administrateurs/calendrier/calendrier.component';
import { DetailsFormationComponent } from './Composants/details-formation/details-formation.component'; // Importation d'un module commun pour certaines directives comme *ngFor
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApercuProgrammeComponent } from './Interfaces/apercu-programme/apercu-programme.component';
import { MesFormationsComponent } from './Interfaces/mes-formations/mes-formations.component';
import { CommentairesComponent } from './Interfaces/commentaires/commentaires.component';
import { DetilsCommentairesComponent } from './Composants/detils-commentaires/detils-commentaires.component';
import { SidebarAdminComponent } from './Interfaces Administrateurs/sidebar-admin/sidebar-admin.component';
import { ActionButtonComponent } from './Composants/action-button/action-button.component';
import { DetailsFormationAdminComponent } from './Composants/details-formation-admin/details-formation-admin.component';
import { NouvelleFormationComponent } from './Interfaces Administrateurs/formations/nouvelle-formation/nouvelle-formation.component';
import { SessionsComponent } from './Interfaces Administrateurs/sessions/sessions.component';
import { PlanningFormateurComponent } from './Interfaces Administrateurs/planning-formateur/planning-formateur.component';
import { DetailsClientsComponent } from './Composants/details-clients/details-clients.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DetailsFourmateursComponent } from './Composants/details-fourmateurs/details-fourmateurs.component';
import { AdministrateursComponent } from './Interfaces Administrateurs/administrateurs/administrateurs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NouvelleSessionComponent } from './Interfaces Administrateurs/sessions/nouvelle-session/nouvelle-session.component';
import { DetailsSupplimentaireClientComponent } from './Interfaces Administrateurs/clients/details-supplimentaire-client/details-supplimentaire-client.component';
import { NouveauClientComponent } from './Interfaces Administrateurs/clients/nouveau-client/nouveau-client.component';
import { MessageService } from 'primeng/api';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TableauDeBordComponent } from './Interfaces Administrateurs/tableau-de-bord/tableau-de-bord.component';
import { TableauDeBordFormationsComponent } from './Interfaces Administrateurs/tableau-de-bord/tableau-de-bord-formations/tableau-de-bord-formations.component';
import { GenererCertificatsComponent } from './Interfaces Administrateurs/certificats/generer-certificats/generer-certificats.component';
import { DetailsSessionsComponent } from './Interfaces Administrateurs/sessions/details-sessions/details-sessions.component';
import { EditSessionsComponent } from './Interfaces Administrateurs/sessions/edit-sessions/edit-sessions.component';
import { ThemesComponent } from './Interfaces Administrateurs/themes/themes.component';
import { EditSalleComponent } from './Interfaces Administrateurs/salles/edit-salle/edit-salle.component';
import { NouvelleSessionsCalendrierComponent } from './Interfaces Administrateurs/calendrier/nouvelle-sessions-calendrier/nouvelle-sessions-calendrier.component';
import { ModifierSessionsCalendrierComponent } from './Interfaces Administrateurs/calendrier/modifier-sessions-calendrier/modifier-sessions-calendrier.component';
import { GenererCertificationAutoComponent } from './Interfaces Administrateurs/certificats/generer-certification-auto/generer-certification-auto.component';
import { PaiementsComponent } from './Interfaces Administrateurs/paiements/paiements.component';
import { NouvelleInscriptionComponent } from './Interfaces Administrateurs/inscription/nouvelle-inscription/nouvelle-inscription.component';
import { DetailsInscriptionComponent } from './Interfaces Administrateurs/inscription/details-inscription/details-inscription.component';
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
import { CalendrierTableauDeBordClientComponent } from './Interfaces/calendrier-tableau-de-bord-client/calendrier-tableau-de-bord-client.component';
import { AvisComponent } from './Interfaces/avis/avis.component';
import { NouveauPaiementComponent } from './Interfaces Administrateurs/paiements/nouveau-paiement/nouveau-paiement.component';
import { FeuilleDePresenceComponent } from './Interfaces Administrateurs/feuille-de-presence/feuille-de-presence.component';

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    CatalogueComponent,
    InscriptionComponent,
    EspacePersonnelComponent,
    FormationsComponent,
    ClientsComponent,
    FormateursComponent,
    SallesComponent,
    CertificatsComponent,
    HeaderComponent,
    SidebarComponent,
    ModalDeConfirmationComponent,
    NotificationComponent,
    PaginationComponent,
    FooterComponent,
    CalendrierComponent,
    DetailsFormationComponent,
    ApercuProgrammeComponent,
    MesFormationsComponent,
    CommentairesComponent,
    DetilsCommentairesComponent,
    SidebarAdminComponent,
    ActionButtonComponent,
    DetailsFormationAdminComponent,
    NouvelleFormationComponent,
    SessionsComponent,
    PlanningFormateurComponent,
    DetailsClientsComponent,
    DetailsFourmateursComponent,
    AdministrateursComponent,
    NouvelleSessionComponent,
    DetailsSupplimentaireClientComponent,
    NouveauClientComponent,
    TableauDeBordComponent,
    TableauDeBordFormationsComponent,
    GenererCertificatsComponent,
    DetailsSessionsComponent,
    EditSessionsComponent,
    ThemesComponent,
    EditSalleComponent,
    NouvelleSessionsCalendrierComponent,
    ModifierSessionsCalendrierComponent,
    GenererCertificationAutoComponent,
    PaiementsComponent,
    NouvelleInscriptionComponent,
    DetailsInscriptionComponent,
    TableauDeBordFinanceComponent,
    DetailsSupplimentaireFormateurComponent,
    NouveauFormateurComponent,
    DetailsSupplimentaireAdminComponent,
    NouveauAdminComponent,
    ProfilComponent,
    LoginComponent,
    AdminLayoutComponent,
    EtudiantLayoutComponent,
    CalendrierClientComponent,
    TableauDeBordClientComponent,
    InscriptionClientComponent,
    MesCertificationsComponent,
    ChangerPwdComponent,
    SignUpComponent,
    CalendrierTableauDeBordClientComponent,
    AvisComponent,
    NouveauPaiementComponent,
    FeuilleDePresenceComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    NgxChartsModule,
    ReactiveFormsModule,
  ],
  exports: [PlanningFormateurComponent],
  providers: [MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
