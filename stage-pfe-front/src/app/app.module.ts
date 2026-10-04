import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccueilComponent } from './Interfaces/accueil/accueil.component';
import { CatalogueComponent } from './Interfaces/catalogue/catalogue.component';
import { InscriptionComponent } from './Interfaces/inscription/inscription.component';
import { EspacePersonnelComponent } from './Interfaces/espace-personnel/espace-personnel.component';
import { FormationsComponent } from './Interfaces/formations/formations.component';
import { ClientsComponent } from './Interfaces/clients/clients.component';
import { FormateursComponent } from './Interfaces/formateurs/formateurs.component';
import { SallesComponent } from './Interfaces/salles/salles.component';
import { CertificatsComponent } from './Interfaces/certificats/certificats.component';
import { HeaderComponent } from './Interfaces/header/header.component';
import { SidebarComponent } from './Interfaces/sidebar/sidebar.component';
import { ModalDeConfirmationComponent } from './Interfaces/modal-de-confirmation/modal-de-confirmation.component';
import { NotificationComponent } from './Interfaces/notification/notification.component';
import { PaginationComponent } from './Interfaces/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { DashbordComponent } from './Interfaces/dashbord/dashbord.component';
import { FooterComponent } from './Interfaces/footer/footer.component';
import { CalendrierComponent } from './Interfaces/calendrier/calendrier.component';
import { DetailsFormationComponent } from './Composants/details-formation/details-formation.component'; // Importation d'un module commun pour certaines directives comme *ngFor
import { HttpClientModule } from '@angular/common/http';
import { ApercuProgrammeComponent } from './Interfaces/apercu-programme/apercu-programme.component';
import { MesFormationsComponent } from './Interfaces/mes-formations/mes-formations.component';
import { CommentairesComponent } from './Interfaces/commentaires/commentaires.component';
import { DetilsCommentairesComponent } from './Composants/detils-commentaires/detils-commentaires.component';
import { SidebarAdminComponent } from './Interfaces/sidebar-admin/sidebar-admin.component';
import { ActionButtonComponent } from './Composants/action-button/action-button.component';
import { DetailsFormationAdminComponent } from './Composants/details-formation-admin/details-formation-admin.component';
import { NouvelleFormationComponent } from './Interfaces/formations/nouvelle-formation/nouvelle-formation.component';
import { SessionsComponent } from './Interfaces/sessions/sessions.component';
import { PlanningFormateurComponent } from './Interfaces/planning-formateur/planning-formateur.component';
import { DetailsClientsComponent } from './Composants/details-clients/details-clients.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DetailsFourmateursComponent } from './Composants/details-fourmateurs/details-fourmateurs.component';
import { AdministrateursComponent } from './Interfaces/administrateurs/administrateurs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NouvelleSessionComponent } from './Interfaces/sessions/nouvelle-session/nouvelle-session.component';
import { DetailsSupplimentaireClientComponent } from './Interfaces/clients/details-supplimentaire-client/details-supplimentaire-client.component';
import { NouveauClientComponent } from './Interfaces/clients/nouveau-client/nouveau-client.component';
import { MessageService } from 'primeng/api';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TableauDeBordComponent } from './Interfaces/tableau-de-bord/tableau-de-bord.component';
import { TableauDeBordFormationsComponent } from './Interfaces/tableau-de-bord/tableau-de-bord-formations/tableau-de-bord-formations.component';
import { GenererCertificatsComponent } from './Interfaces/certificats/generer-certificats/generer-certificats.component';
import { DetailsSessionsComponent } from './Interfaces/sessions/details-sessions/details-sessions.component';
import { EditSessionsComponent } from './Interfaces/sessions/edit-sessions/edit-sessions.component';
import { CertificatDetailDialogComponent } from './Interfaces/certificats/certificat-detail-dialog/certificat-detail-dialog.component';
import { ConfirmDialogComponent } from './Interfaces/certificats/confirm-dialog/confirm-dialog.component';

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
    DashbordComponent,
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
    CertificatDetailDialogComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    NgxChartsModule
   
  ],
  exports: [PlanningFormateurComponent],
  providers: [MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}