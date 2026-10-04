/* tslint:disable */
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpResponse,
  HttpHeaders,
} from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { SallesDto } from '../models/salles-dto';
import { CertificatsDto } from '../models/certificats-dto';
import { FormationsDto } from '../models/formations-dto';
import { InscriptionDto } from '../models/inscription-dto';
import { PaiementsDto } from '../models/paiements-dto';
import { SessionsDto } from '../models/sessions-dto';
import { Utilisateurs } from '../models/utilisateurs';
import { ThemesDto } from '../models/themes-dto';
import { UtilisateursDto } from '../models/utilisateurs-dto';
import {
  AuthenticationResponse,
  AvisDto,
  Email,
  NotificationsDto,
} from '../models';
import { Notifications } from '../models/notifications';

@Injectable({
  providedIn: 'root',
})
class ApiService extends __BaseService {
  static readonly getAllSallesPath = 'api/all';
  static readonly getAllCertificatsPath = '/api/certificats/all';
  static readonly findAllPath = '/api/commentaires/all';
  static readonly savePath = '/api/commentaires/create';
  static readonly findByIdPath = '/api/commentaires/{id}';
  static readonly deletePath = '/api/commentaires/{id}';
  static readonly findAllFormationsPath = '/api/formations/all';
  static readonly deleteFormationPath = '/api/formations/delete/{id}';
  static readonly countFormationsPath = '/api/formations/formations/count';
  static readonly sortFormationsByDureePath =
    '/api/formations/formations/sortByDuree';
  static readonly findFormationByIdPath = '/api/formations/id/{id}';
  static readonly findByNiveauPath = '/api/formations/niveau/{niveau}';
  static readonly findByPrixBetweenPath = '/api/formations/prix';
  static readonly saveFormationPath = '/api/formations/save';
  static readonly searchFormationsPath = '/api/formations/search';
  static readonly findByStatutPath = '/api/formations/statut/{statut}';
  static readonly findByThemeIdPath = '/api/formations/theme/{themeId}';
  static readonly updateFormationPath = '/api/formations/updateFormation';
  static readonly findAll_1Path = '/api/inscriptions/all';
  static readonly deleteInscriptionPath = '/api/inscriptions/delete/{id}';
  static readonly getInscriptionsNonGenereesPath =
    '/api/inscriptions/getInscriptionsNonGenerees';
  static readonly saveInscriptionPath = '/api/inscriptions/save';
  static readonly findByStatut_1Path = '/api/inscriptions/status/{statut}';
  static readonly transformCertificatToGeneratePath =
    '/api/inscriptions/update-certificat-de-0-a-1/{id}';
  static readonly transformCertificatToNonGeneratePath =
    '/api/inscriptions/update-certificat-genere-de-1-a-0/{id}';
  static readonly updateInscriptionPath = '/api/inscriptions/update/{id}';
  static readonly getInscriptionByIdPath = '/api/inscriptions/{id}';
  static readonly ChiffreAffaireTotalPath =
    '/api/paiements/ChiffreAffaireTotal';

  static readonly CoutsEmployesParPeriodePath =
    '/api/paiements/CoutsEmployesParPeriode';

  static readonly CoutsFormateursParPeriodePath =
    '/api/paiements/CoutsFormateursParPeriode';

  static readonly CoutsMoyenDuFormateurPath =
    '/api/paiements/CoutsMoyenDuFormateur';

  static readonly findAllPaiementsPath = '/api/paiements/all';

  static readonly calculerProfitTotalPath =
    '/api/paiements/calculerProfitTotal';

  static readonly ChiffreAffaireEtudiantParPeriodePath =
    '/api/paiements/chiffre-affaire-periode';

  static readonly coutTotalDesEmployeePath =
    '/api/paiements/coutTotalDesEmployee';

  static readonly coutTotalDesFormateursExternePath =
    '/api/paiements/coutTotalDesFormateursExterne';

  static readonly coutTotalDesFormateursInternePath =
    '/api/paiements/coutTotalDesFormateursInterne';

  static readonly CoutsEstimesPath =
    '/api/paiements/couts-estimes/{formationId}';

  static readonly revenuMoyenParEtudiantPath =
    '/api/paiements/revenuMoyenParEtudiant';

  static readonly revenuMoyenParSessionPath =
    '/api/paiements/revenuMoyenParSession';
  static readonly savePaiementPath = '/api/paiements/save';
  static readonly updatePaiementPath = '/api/paiements/updatePaiement';
  static readonly findPaiementByIdPath = '/api/paiements/{id}';
  static readonly deletePaiementPath = '/api/paiements/{id}';
  static readonly findAll_2Path = '/api/sessions/all';
  static readonly findByDateBetweenPath = '/api/sessions/date-range';
  static readonly findByFormateurPath =
    '/api/sessions/findByFormateurid/{formateurId}';
  static readonly findByFormationPath = '/api/sessions/formation/{formationId}';
  static readonly save_1Path = '/api/sessions/save';
  static readonly findUpcomingSessionsPath = '/api/sessions/upcoming';
  static readonly updatesessionsPath = '/api/sessions/update';
  static readonly findById_1Path = '/api/sessions/{id}';
  static readonly delete_1Path = '/api/sessions/{id}';
  static readonly getAvailablePlacesPath =
    '/api/sessions/{sessionId}/available-places';
  static readonly getFormateurPath = '/api/sessions/{sessionId}/getFormateur';
  static readonly getStudentParticipantsPath =
    '/api/sessions/{sessionId}/getStudentParticipants';
  static readonly getParticipantsPath =
    '/api/sessions/{sessionId}/participants';
  static readonly findAll_3Path = '/api/themes';
  static readonly save_2Path = '/api/themes';
  static readonly themeExistsPath = '/api/themes/exists';
  static readonly findThemesByFormationPath =
    '/api/themes/formation/{formationId}';
  static readonly findByNamePath = '/api/themes/search';
  static readonly findById_2Path = '/api/themes/{id}';
  static readonly updateThemePath = '/api/themes/{id}';
  static readonly delete_2Path = '/api/themes/{id}';
  static readonly assignThemeToFormationPath =
    '/api/themes/{themeId}/formation/{formationId}';
  static readonly findPersonnelCNIPath = '/api/utilisateurs/Personnel_CNI';
  static readonly findAdministrateursPath = '/api/utilisateurs/administrateurs';
  static readonly findAll_4Path = '/api/utilisateurs/all';
  static readonly save_3Path = '/api/utilisateurs/create';
  static readonly delete_3Path = '/api/utilisateurs/delete/{idUtilisateur}';
  static readonly findEtudiantsPath = '/api/utilisateurs/etudiants';
  static readonly findByEmailPath = '/api/utilisateurs/find/{email}';
  static readonly findFormateurexternePath =
    '/api/utilisateurs/findFormateurexterne';
  static readonly findFormateurinternePath =
    '/api/utilisateurs/findFormateurinternes';
  static readonly findFormateurPath = '/api/utilisateurs/formateurs';
  static readonly getUtilisateurByInscriptionIdPath =
    '/api/utilisateurs/inscription/{id}';
  static readonly changerMotDePassePath = '/api/utilisateurs/update/password';
  static readonly updateUtilisateursPath =
    '/api/utilisateurs/updateUtilisateurs';
  static readonly findById_3Path = '/api/utilisateurs/{idUtilisateur}';
  static readonly genererCertificatPath = '/api/generer';
  static readonly getCertificatByNumeroDeSeriePath =
    '/api/numero/{numeroSerie}';
  static readonly save_4Path = 'api/save';
  static readonly supprimerCertificatByNumeroDeSeriePath =
    '/supprimerCertificatByNumeroDeSerie/{numeroSerie}';
  static readonly getCertificatByIdPath = '/{idUtilisateur}';
  static readonly supprimerCertificatPath = '/{idUtilisateur}';
  static readonly findById_4Path = 'api/salles/{id}';
  static readonly delete_4Path = 'api/salles/{id}';
  static readonly authenticatePath = '/authentication/authenticate';
  static readonly getFormationsByUserIdPath = '/api/formations/user/{userId}';
  static readonly sendNotificationPath = '/api/notifications/send';
  static readonly sendEmailPath = '/api/notifications/send-email';
  static readonly findAvailableSessionsByFormationIdPath =
    '/api/sessions/findAvailableSessionsByFormationId/{formationId}';
  static readonly getCertificatsByUserIdPath =
    '/api/certificats/user/{utilisateurId}';
  static readonly updateCertificatStatusPath =
    '/api/certificats/updateStatus/{idCertificat}';
  static readonly envoyerEmailPath = '/api/email/envoyer';
  static readonly envoyerEmailAvecPieceJointePath =
    '/api/email/envoyer-avec-piece-jointe';
  static readonly envoyerEmailAvecTemplatePath =
    '/api/email/envoyer-avec-template/{templateName}';
  static readonly deleteNotificationPath = '/api/delete/{notificationId}';
  static readonly createNotificationPath =
    '/api/notifications/createNotification';
  static readonly getNotificationsByUserPath = '/api/user/{userId}';
  static readonly addUserToSessionPath =
    '/api/sessions/addUserToSession/{sessionId}/{utilisateurId}';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * @return successful operation
   */
  getAllSallesResponse(): __Observable<__StrictHttpResponse<Array<SallesDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `/api/all`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json',
    });

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<SallesDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  getAllSalles(): __Observable<Array<SallesDto>> {
    return this.getAllSallesResponse().pipe(
      __map((_r) => _r.body as Array<SallesDto>)
    );
  }

  /**
   * @return successful operation
   */
  getAllCertificatsResponse(): __Observable<
    __StrictHttpResponse<Array<CertificatsDto>>
  > {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/certificats/all`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<CertificatsDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  getAllCertificats(): __Observable<Array<CertificatsDto>> {
    return this.getAllCertificatsResponse().pipe(
      __map((_r) => _r.body as Array<CertificatsDto>)
    );
  }

  /**
   * @return successful operation
   */
  findAllResponse(): __Observable<__StrictHttpResponse<Array<AvisDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/commentaires/all`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<AvisDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findAll(): __Observable<Array<AvisDto>> {
    return this.findAllResponse().pipe(
      __map((_r) => _r.body as Array<AvisDto>)
    );
  }

  /**
   * @return successful operation
   */
  saveResponse(AvisDto: AvisDto): __Observable<__StrictHttpResponse<AvisDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = AvisDto;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/commentaires/create`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<AvisDto>;
      })
    );
  }
  /**
   * @return successful operation
   */
  save(AvisDto: AvisDto): __Observable<AvisDto> {
    return this.saveResponse(AvisDto).pipe(__map((_r) => _r.body as AvisDto));
  }

  /**
   * @return successful operation
   */
  findByIdResponse(id: any): __Observable<__StrictHttpResponse<AvisDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/commentaires/${encodeURIComponent(String(id))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<AvisDto>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findById(id: any): __Observable<AvisDto> {
    return this.findByIdResponse(id).pipe(__map((_r) => _r.body as AvisDto));
  }
  deleteResponse(id: any): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/api/commentaires/${encodeURIComponent(String(id))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  delete(id: any): __Observable<null> {
    return this.deleteResponse(id).pipe(__map((_r) => _r.body as null));
  }

  /**
   * @return successful operation
   */
  findAllFormationsResponse(): __Observable<
    __StrictHttpResponse<Array<FormationsDto>>
  > {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/formations/all`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<FormationsDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findAllFormations(): __Observable<Array<FormationsDto>> {
    return this.findAllFormationsResponse().pipe(
      __map((_r) => _r.body as Array<FormationsDto>)
    );
  }
  deleteFormationResponse(id: any): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/api/formations/delete/${encodeURIComponent(String(id))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  deleteFormation(id: any): __Observable<null> {
    return this.deleteFormationResponse(id).pipe(
      __map((_r) => _r.body as null)
    );
  }

  /**
   * @return successful operation
   */
  countFormationsResponse(): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/formations/formations/count`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({
          body: parseFloat((_r as HttpResponse<any>).body as string),
        }) as __StrictHttpResponse<number>;
      })
    );
  }
  /**
   * @return successful operation
   */
  countFormations(): __Observable<number> {
    return this.countFormationsResponse().pipe(
      __map((_r) => _r.body as number)
    );
  }

  /**
   * @param ascending undefined
   * @return successful operation
   */
  sortFormationsByDureeResponse(
    ascending?: boolean
  ): __Observable<__StrictHttpResponse<Array<FormationsDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (ascending != null)
      __params = __params.set('ascending', ascending.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/formations/formations/sortByDuree`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<FormationsDto>>;
      })
    );
  }
  /**
   * @param ascending undefined
   * @return successful operation
   */
  sortFormationsByDuree(
    ascending?: boolean
  ): __Observable<Array<FormationsDto>> {
    return this.sortFormationsByDureeResponse(ascending).pipe(
      __map((_r) => _r.body as Array<FormationsDto>)
    );
  }

  /**
   * @return successful operation
   */
  findFormationByIdResponse(
    id: any
  ): __Observable<__StrictHttpResponse<FormationsDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/formations/id/${encodeURIComponent(String(id))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<FormationsDto>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findFormationById(id: any): __Observable<FormationsDto> {
    return this.findFormationByIdResponse(id).pipe(
      __map((_r) => _r.body as FormationsDto)
    );
  }

  /**
   * @return successful operation
   */
  findByNiveauResponse(
    niveau: any
  ): __Observable<__StrictHttpResponse<Array<FormationsDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl +
        `/api/formations/niveau/${encodeURIComponent(String(niveau))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<FormationsDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findByNiveau(niveau: any): __Observable<Array<FormationsDto>> {
    return this.findByNiveauResponse(niveau).pipe(
      __map((_r) => _r.body as Array<FormationsDto>)
    );
  }

  /**
   * @return successful operation
   */
  findByPrixBetweenResponse(): __Observable<
    __StrictHttpResponse<Array<FormationsDto>>
  > {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/formations/prix`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<FormationsDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findByPrixBetween(): __Observable<Array<FormationsDto>> {
    return this.findByPrixBetweenResponse().pipe(
      __map((_r) => _r.body as Array<FormationsDto>)
    );
  }

  /**
   * @return successful operation
   */
  saveFormationResponse(
    formationsDto: any
  ): __Observable<__StrictHttpResponse<FormationsDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/formations/save`,
      formationsDto,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<FormationsDto>;
      })
    );
  }
  /**
   * @return successful operation
   */
  saveFormation(formationsDto: any): __Observable<FormationsDto> {
    return this.saveFormationResponse(formationsDto).pipe(
      __map((_r) => _r.body as FormationsDto)
    );
  }

  /**
   * @return successful operation
   */
  searchFormationsResponse(): __Observable<
    __StrictHttpResponse<Array<FormationsDto>>
  > {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/formations/search`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<FormationsDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  searchFormations(): __Observable<Array<FormationsDto>> {
    return this.searchFormationsResponse().pipe(
      __map((_r) => _r.body as Array<FormationsDto>)
    );
  }

  /**
   * @return successful operation
   */
  findByStatutResponse(
    statut: any
  ): __Observable<__StrictHttpResponse<Array<FormationsDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl +
        `/api/formations/statut/${encodeURIComponent(String(statut))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<FormationsDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findByStatut(statut: any): __Observable<Array<FormationsDto>> {
    return this.findByStatutResponse(statut).pipe(
      __map((_r) => _r.body as Array<FormationsDto>)
    );
  }

  /**
   * @return successful operation
   */
  findByThemeIdResponse(
    themeId: any
  ): __Observable<__StrictHttpResponse<Array<FormationsDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl +
        `/api/formations/theme/${encodeURIComponent(String(themeId))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<FormationsDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findByThemeId(themeId: any): __Observable<Array<FormationsDto>> {
    return this.findByThemeIdResponse(themeId).pipe(
      __map((_r) => _r.body as Array<FormationsDto>)
    );
  }

  /**
   * @return successful operation
   */
  updateFormationResponse(
    FormationsDto: any
  ): __Observable<__StrictHttpResponse<FormationsDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let __body: any = FormationsDto;

    let req = new HttpRequest<any>(
      'PUT', // Changez PUT en POST ici
      this.rootUrl + `/api/formations/updateFormation`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<FormationsDto>;
      })
    );
  }

  /**
   * @return successful operation
   */
  updateFormation(FormationsDto: any): __Observable<FormationsDto> {
    return this.updateFormationResponse(FormationsDto).pipe(
      __map((_r) => _r.body as FormationsDto)
    );
  }

  /**
   * @return successful operation
   */
  findAll_1Response(): __Observable<
    __StrictHttpResponse<Array<InscriptionDto>>
  > {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/inscriptions/all`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<InscriptionDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findAll_1(): __Observable<Array<InscriptionDto>> {
    return this.findAll_1Response().pipe(
      __map((_r) => _r.body as Array<InscriptionDto>)
    );
  }
  deleteInscriptionResponse(id: any): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl +
        `/api/inscriptions/delete/${encodeURIComponent(String(id))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  deleteInscription(id: any): __Observable<null> {
    return this.deleteInscriptionResponse(id).pipe(
      __map((_r) => _r.body as null)
    );
  }

  /**
   * @return successful operation
   */
  getInscriptionsNonGenereesResponse(): __Observable<
    __StrictHttpResponse<Array<InscriptionDto>>
  > {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/inscriptions/getInscriptionsNonGenerees`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<InscriptionDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  getInscriptionsNonGenerees(): __Observable<Array<InscriptionDto>> {
    return this.getInscriptionsNonGenereesResponse().pipe(
      __map((_r) => _r.body as Array<InscriptionDto>)
    );
  }

  /**
   * @return successful operation
   */
  saveInscriptionResponse(
    InscriptionDto: InscriptionDto
  ): __Observable<__StrictHttpResponse<InscriptionDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = InscriptionDto;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/inscriptions/add`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<InscriptionDto>;
      })
    );
  }
  /**
   * @return successful operation
   */
  saveInscription(
    InscriptionDto: InscriptionDto
  ): __Observable<InscriptionDto> {
    return this.saveInscriptionResponse(InscriptionDto).pipe(
      __map((_r) => _r.body as InscriptionDto)
    );
  }

  /**
   * @return successful operation
   */
  findByStatut_1Response(
    statut: any
  ): __Observable<__StrictHttpResponse<Array<InscriptionDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl +
        `/api/inscriptions/status/${encodeURIComponent(String(statut))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<InscriptionDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findByStatut_1(statut: any): __Observable<Array<InscriptionDto>> {
    return this.findByStatut_1Response(statut).pipe(
      __map((_r) => _r.body as Array<InscriptionDto>)
    );
  }
  transformCertificatToGenerateResponse(
    id: any
  ): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'PUT',
      this.rootUrl +
        `/api/inscriptions/update-certificat-de-0-a-1/${encodeURIComponent(
          String(id)
        )}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  transformCertificatToGenerate(id: any): __Observable<null> {
    return this.transformCertificatToGenerateResponse(id).pipe(
      __map((_r) => _r.body as null)
    );
  }
  transformCertificatToNonGenerateResponse(
    id: any
  ): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'PUT',
      this.rootUrl +
        `/api/inscriptions/update-certificat-genere-de-1-a-0/${encodeURIComponent(
          String(id)
        )}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  transformCertificatToNonGenerate(id: any): __Observable<null> {
    return this.transformCertificatToNonGenerateResponse(id).pipe(
      __map((_r) => _r.body as null)
    );
  }

  /**
   * @return successful operation
   */
  updateInscriptionResponse(
    id: any,
    body: InscriptionDto
  ): __Observable<__StrictHttpResponse<InscriptionDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let req = new HttpRequest<any>(
      'PUT',
      this.rootUrl +
        `/api/inscriptions/update/${encodeURIComponent(String(id))}`,
      body, // 🔥 on envoie bien le DTO ici
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<InscriptionDto>;
      })
    );
  }

  /**
   * @return successful operation
   */
  updateInscription(
    id: any,
    body: InscriptionDto
  ): __Observable<InscriptionDto> {
    return this.updateInscriptionResponse(id, body).pipe(
      __map((_r) => _r.body as InscriptionDto)
    );
  }

  /**
   * @return successful operation
   */
  getInscriptionByIdResponse(
    id: any
  ): __Observable<__StrictHttpResponse<InscriptionDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/inscriptions/${encodeURIComponent(String(id))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<InscriptionDto>;
      })
    );
  }
  /**
   * @return successful operation
   */
  getInscriptionById(id: any): __Observable<InscriptionDto> {
    return this.getInscriptionByIdResponse(id).pipe(
      __map((_r) => _r.body as InscriptionDto)
    );
  }

  /**
   * @return successful operation
   */
  ChiffreAffaireTotalResponse(): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/paiements/ChiffreAffaireTotal`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({
          body: parseFloat((_r as HttpResponse<any>).body as string),
        }) as __StrictHttpResponse<number>;
      })
    );
  }
  /**
   * @return successful operation
   */
  ChiffreAffaireTotal(): __Observable<number> {
    return this.ChiffreAffaireTotalResponse().pipe(
      __map((_r) => _r.body as number)
    );
  }

  /**
   * @param params The `ApiService.CoutsEmployesParPeriodeParams` containing the following parameters:
   *
   * - `fin`:
   *
   * - `debut`:
   *
   * @return successful operation
   */
  CoutsEmployesParPeriodeResponse(
    params: ApiService.CoutsEmployesParPeriodeParams
  ): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.fin != null)
      __params = __params.set('fin', params.fin.toString());
    if (params.debut != null)
      __params = __params.set('debut', params.debut.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/paiements/CoutsEmployesParPeriode`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({
          body: parseFloat((_r as HttpResponse<any>).body as string),
        }) as __StrictHttpResponse<number>;
      })
    );
  }
  /**
   * @param params The `ApiService.CoutsEmployesParPeriodeParams` containing the following parameters:
   *
   * - `fin`:
   *
   * - `debut`:
   *
   * @return successful operation
   */
  CoutsEmployesParPeriode(
    params: ApiService.CoutsEmployesParPeriodeParams
  ): __Observable<number> {
    return this.CoutsEmployesParPeriodeResponse(params).pipe(
      __map((_r) => _r.body as number)
    );
  }

  /**
   * @param params The `ApiService.CoutsFormateursParPeriodeParams` containing the following parameters:
   *
   * - `fin`:
   *
   * - `debut`:
   *
   * @return successful operation
   */
  CoutsFormateursParPeriodeResponse(
    params: ApiService.CoutsFormateursParPeriodeParams
  ): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.fin != null)
      __params = __params.set('fin', params.fin.toString());
    if (params.debut != null)
      __params = __params.set('debut', params.debut.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/paiements/CoutsFormateursParPeriode`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({
          body: parseFloat((_r as HttpResponse<any>).body as string),
        }) as __StrictHttpResponse<number>;
      })
    );
  }
  /**
   * @param params The `ApiService.CoutsFormateursParPeriodeParams` containing the following parameters:
   *
   * - `fin`:
   *
   * - `debut`:
   *
   * @return successful operation
   */
  CoutsFormateursParPeriode(
    params: ApiService.CoutsFormateursParPeriodeParams
  ): __Observable<number> {
    return this.CoutsFormateursParPeriodeResponse(params).pipe(
      __map((_r) => _r.body as number)
    );
  }

  /**
   * @return successful operation
   */
  CoutsMoyenDuFormateurResponse(): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/paiements/CoutsMoyenDuFormateur`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({
          body: parseFloat((_r as HttpResponse<any>).body as string),
        }) as __StrictHttpResponse<number>;
      })
    );
  }
  /**
   * @return successful operation
   */
  CoutsMoyenDuFormateur(): __Observable<number> {
    return this.CoutsMoyenDuFormateurResponse().pipe(
      __map((_r) => _r.body as number)
    );
  }

  /**
   * @return successful operation
   */
  findAllPaiementsResponse(): __Observable<
    __StrictHttpResponse<Array<PaiementsDto>>
  > {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/paiements/all`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<PaiementsDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findAllPaiements(): __Observable<Array<PaiementsDto>> {
    return this.findAllPaiementsResponse().pipe(
      __map((_r) => _r.body as Array<PaiementsDto>)
    );
  }

  /**
   * @param params The `ApiService.CalculerProfitTotalParams` containing the following parameters:
   *
   * - `fin`:
   *
   * - `debut`:
   *
   * @return successful operation
   */
  calculerProfitTotalResponse(
    params: ApiService.CalculerProfitTotalParams
  ): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.fin != null)
      __params = __params.set('fin', params.fin.toString());
    if (params.debut != null)
      __params = __params.set('debut', params.debut.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/paiements/calculerProfitTotal`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({
          body: parseFloat((_r as HttpResponse<any>).body as string),
        }) as __StrictHttpResponse<number>;
      })
    );
  }
  /**
   * @param params The `ApiService.CalculerProfitTotalParams` containing the following parameters:
   *
   * - `fin`:
   *
   * - `debut`:
   *
   * @return successful operation
   */
  calculerProfitTotal(
    params: ApiService.CalculerProfitTotalParams
  ): __Observable<number> {
    return this.calculerProfitTotalResponse(params).pipe(
      __map((_r) => _r.body as number)
    );
  }

  /**
   * @param params The `ApiService.ChiffreAffaireEtudiantParPeriodeParams` containing the following parameters:
   *
   * - `fin`:
   *
   * - `debut`:
   *
   * @return successful operation
   */
  ChiffreAffaireEtudiantParPeriodeResponse(
    params: ApiService.ChiffreAffaireEtudiantParPeriodeParams
  ): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.fin != null)
      __params = __params.set('fin', params.fin.toString());
    if (params.debut != null)
      __params = __params.set('debut', params.debut.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/paiements/chiffre-affaire-periode`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({
          body: parseFloat((_r as HttpResponse<any>).body as string),
        }) as __StrictHttpResponse<number>;
      })
    );
  }
  /**
   * @param params The `ApiService.ChiffreAffaireEtudiantParPeriodeParams` containing the following parameters:
   *
   * - `fin`:
   *
   * - `debut`:
   *
   * @return successful operation
   */
  ChiffreAffaireEtudiantParPeriode(
    params: ApiService.ChiffreAffaireEtudiantParPeriodeParams
  ): __Observable<number> {
    return this.ChiffreAffaireEtudiantParPeriodeResponse(params).pipe(
      __map((_r) => _r.body as number)
    );
  }

  /**
   * @return successful operation
   */
  coutTotalDesEmployeeResponse(): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/paiements/coutTotalDesEmployee`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({
          body: parseFloat((_r as HttpResponse<any>).body as string),
        }) as __StrictHttpResponse<number>;
      })
    );
  }
  /**
   * @return successful operation
   */
  coutTotalDesEmployee(): __Observable<number> {
    return this.coutTotalDesEmployeeResponse().pipe(
      __map((_r) => _r.body as number)
    );
  }

  /**
   * @return successful operation
   */
  coutTotalDesFormateursExterneResponse(): __Observable<
    __StrictHttpResponse<number>
  > {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/paiements/coutTotalDesFormateursExterne`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({
          body: parseFloat((_r as HttpResponse<any>).body as string),
        }) as __StrictHttpResponse<number>;
      })
    );
  }
  /**
   * @return successful operation
   */
  coutTotalDesFormateursExterne(): __Observable<number> {
    return this.coutTotalDesFormateursExterneResponse().pipe(
      __map((_r) => _r.body as number)
    );
  }

  /**
   * @return successful operation
   */
  coutTotalDesFormateursInterneResponse(): __Observable<
    __StrictHttpResponse<number>
  > {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/paiements/coutTotalDesFormateursInterne`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({
          body: parseFloat((_r as HttpResponse<any>).body as string),
        }) as __StrictHttpResponse<number>;
      })
    );
  }
  /**
   * @return successful operation
   */
  coutTotalDesFormateursInterne(): __Observable<number> {
    return this.coutTotalDesFormateursInterneResponse().pipe(
      __map((_r) => _r.body as number)
    );
  }

  /**
   * @param formationId undefined
   * @return successful operation
   */
  CoutsEstimesResponse(
    formationId: number
  ): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl +
        `/api/paiements/couts-estimes/${encodeURIComponent(
          String(formationId)
        )}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({
          body: parseFloat((_r as HttpResponse<any>).body as string),
        }) as __StrictHttpResponse<number>;
      })
    );
  }
  /**
   * @param formationId undefined
   * @return successful operation
   */
  CoutsEstimes(formationId: any): __Observable<number> {
    return this.CoutsEstimesResponse(formationId).pipe(
      __map((_r) => _r.body as number)
    );
  }

  /**
   * @return successful operation
   */
  revenuMoyenParEtudiantResponse(): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/paiements/revenuMoyenParEtudiant`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({
          body: parseFloat((_r as HttpResponse<any>).body as string),
        }) as __StrictHttpResponse<number>;
      })
    );
  }
  /**
   * @return successful operation
   */
  revenuMoyenParEtudiant(): __Observable<number> {
    return this.revenuMoyenParEtudiantResponse().pipe(
      __map((_r) => _r.body as number)
    );
  }

  /**
   * @return successful operation
   */
  revenuMoyenParSessionResponse(): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/paiements/revenuMoyenParSession`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({
          body: parseFloat((_r as HttpResponse<any>).body as string),
        }) as __StrictHttpResponse<number>;
      })
    );
  }
  /**
   * @return successful operation
   */
  revenuMoyenParSession(): __Observable<number> {
    return this.revenuMoyenParSessionResponse().pipe(
      __map((_r) => _r.body as number)
    );
  }

  /**
   * @return successful operation
   */
  savePaiementResponse(
    PaiementsDto: PaiementsDto
  ): __Observable<__StrictHttpResponse<PaiementsDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = PaiementsDto;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/paiements/save`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PaiementsDto>;
      })
    );
  }
  /**
   * @return successful operation
   */
  savePaiement(PaiementsDto: PaiementsDto): __Observable<PaiementsDto> {
    return this.savePaiementResponse(PaiementsDto).pipe(
      __map((_r) => _r.body as PaiementsDto)
    );
  }

  /**
   * @return successful operation
   */
  updatePaiementResponse(
    PaiementsDto: PaiementsDto
  ): __Observable<__StrictHttpResponse<PaiementsDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = PaiementsDto;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/paiements/updatePaiement`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PaiementsDto>;
      })
    );
  }
  /**
   * @return successful operation
   */
  updatePaiement(PaiementsDto: PaiementsDto): __Observable<PaiementsDto> {
    return this.updatePaiementResponse(PaiementsDto).pipe(
      __map((_r) => _r.body as PaiementsDto)
    );
  }

  /**
   * @return successful operation
   */
  findPaiementByIdResponse(
    id: any
  ): __Observable<__StrictHttpResponse<PaiementsDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/paiements/${encodeURIComponent(String(id))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PaiementsDto>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findPaiementById(id: any): __Observable<PaiementsDto> {
    return this.findPaiementByIdResponse(id).pipe(
      __map((_r) => _r.body as PaiementsDto)
    );
  }
  deletePaiementResponse(id: any): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/api/paiements/${encodeURIComponent(String(id))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  deletePaiement(id: any): __Observable<null> {
    return this.deletePaiementResponse(id).pipe(__map((_r) => _r.body as null));
  }

  /**
   * @return successful operation
   */
  findAll_2Response(): __Observable<__StrictHttpResponse<Array<SessionsDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/sessions/all`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<SessionsDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findAll_2(): __Observable<Array<SessionsDto>> {
    return this.findAll_2Response().pipe(
      __map((_r) => _r.body as Array<SessionsDto>)
    );
  }

  /**
   * @param params The `ApiService.FindByDateBetweenParams` containing the following parameters:
   *
   * - `startDate`:
   *
   * - `endDate`:
   *
   * @return successful operation
   */
  findByDateBetweenResponse(
    params: ApiService.FindByDateBetweenParams
  ): __Observable<__StrictHttpResponse<Array<SessionsDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.startDate != null)
      __params = __params.set('startDate', params.startDate.toString());
    if (params.endDate != null)
      __params = __params.set('endDate', params.endDate.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/sessions/date-range`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<SessionsDto>>;
      })
    );
  }
  /**
   * @param params The `ApiService.FindByDateBetweenParams` containing the following parameters:
   *
   * - `startDate`:
   *
   * - `endDate`:
   *
   * @return successful operation
   */
  findByDateBetween(
    params: ApiService.FindByDateBetweenParams
  ): __Observable<Array<SessionsDto>> {
    return this.findByDateBetweenResponse(params).pipe(
      __map((_r) => _r.body as Array<SessionsDto>)
    );
  }

  /**
   * @param formateurId undefined
   * @return successful operation
   */
  findByFormateurResponse(
    formateurId: number
  ): __Observable<__StrictHttpResponse<Array<SessionsDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl +
        `/api/sessions/findByFormateurid/${encodeURIComponent(
          String(formateurId)
        )}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<SessionsDto>>;
      })
    );
  }
  /**
   * @param formateurId undefined
   * @return successful operation
   */
  findByFormateur(formateurId: number): __Observable<Array<SessionsDto>> {
    return this.findByFormateurResponse(formateurId).pipe(
      __map((_r) => _r.body as Array<SessionsDto>)
    );
  }

  /**
   * @param formationId undefined
   * @return successful operation
   */
  findByFormationResponse(
    formationId: number
  ): __Observable<__StrictHttpResponse<Array<SessionsDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl +
        `/api/sessions/formation/${encodeURIComponent(String(formationId))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<SessionsDto>>;
      })
    );
  }
  /**
   * @param formationId undefined
   * @return successful operation
   */
  findByFormation(formationId: number): __Observable<Array<SessionsDto>> {
    return this.findByFormationResponse(formationId).pipe(
      __map((_r) => _r.body as Array<SessionsDto>)
    );
  }

  /**
   * @return successful operation
   */
  save_1Response(
    SessionsDto: any
  ): __Observable<__StrictHttpResponse<SessionsDto>> {
    let __params = this.newParams();

    let __headers = new HttpHeaders();

    let __body: any = SessionsDto;

    let req = new HttpRequest<any>(
      'POST',

      this.rootUrl + `/api/sessions/save`,

      __body,

      {
        headers: __headers,

        params: __params,

        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),

      __map((_r) => {
        return _r as __StrictHttpResponse<SessionsDto>;
      })
    );
  }

  /**

   * @return successful operation

   */

  save_1(SessionsDto: any): __Observable<SessionsDto> {
    return this.save_1Response(SessionsDto).pipe(
      __map((_r) => _r.body as SessionsDto)
    );
  }

  /**
   * @return successful operation
   */
  findUpcomingSessionsResponse(): __Observable<
    __StrictHttpResponse<Array<SessionsDto>>
  > {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/sessions/upcoming`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<SessionsDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findUpcomingSessions(): __Observable<Array<SessionsDto>> {
    return this.findUpcomingSessionsResponse().pipe(
      __map((_r) => _r.body as Array<SessionsDto>)
    );
  }

  /**
   * @return successful operation
   */
  updatesessionsResponse(
    SessionsDto: any
  ): __Observable<__StrictHttpResponse<SessionsDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = SessionsDto;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/sessions/update`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<SessionsDto>;
      })
    );
  }
  /**
   * @return successful operation
   */
  updatesessions(SessionsDto: any): __Observable<SessionsDto> {
    return this.updatesessionsResponse(SessionsDto).pipe(
      __map((_r) => _r.body as SessionsDto)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findById_1Response(
    id: number
  ): __Observable<__StrictHttpResponse<SessionsDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/sessions/${encodeURIComponent(String(id))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<SessionsDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findById_1(id: any): __Observable<SessionsDto> {
    return this.findById_1Response(id).pipe(
      __map((_r) => _r.body as SessionsDto)
    );
  }

  /**
   * @param id undefined
   */
  delete_1Response(id: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/api/sessions/${encodeURIComponent(String(id))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param id undefined
   */
  delete_1(id: any): __Observable<null> {
    return this.delete_1Response(id).pipe(__map((_r) => _r.body as null));
  }

  /**
   * @param sessionId undefined
   * @return successful operation
   */
  getAvailablePlacesResponse(
    sessionId: number
  ): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl +
        `/api/sessions/${encodeURIComponent(
          String(sessionId)
        )}/available-places`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({
          body: parseFloat((_r as HttpResponse<any>).body as string),
        }) as __StrictHttpResponse<number>;
      })
    );
  }
  /**
   * @param sessionId undefined
   * @return successful operation
   */
  getAvailablePlaces(sessionId: number): __Observable<number> {
    return this.getAvailablePlacesResponse(sessionId).pipe(
      __map((_r) => _r.body as number)
    );
  }

  /**
   * @return successful operation
   */
  getFormateurResponse(
    sessionId: any
  ): __Observable<__StrictHttpResponse<Array<Utilisateurs>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl +
        `/api/sessions/${encodeURIComponent(String(sessionId))}/getFormateur`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<Utilisateurs>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  getFormateur(sessionId: any): __Observable<Array<Utilisateurs>> {
    return this.getFormateurResponse(sessionId).pipe(
      __map((_r) => _r.body as Array<Utilisateurs>)
    );
  }

  /**
   * @return successful operation
   */
  getStudentParticipantsResponse(
    sessionId: any
  ): __Observable<__StrictHttpResponse<Array<Utilisateurs>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl +
        `/api/sessions/${encodeURIComponent(
          String(sessionId)
        )}/getStudentParticipants`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<Utilisateurs>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  getStudentParticipants(sessionId: any): __Observable<Array<Utilisateurs>> {
    return this.getStudentParticipantsResponse(sessionId).pipe(
      __map((_r) => _r.body as Array<Utilisateurs>)
    );
  }

  /**
   * @param sessionId undefined
   * @return successful operation
   */
  getParticipantsResponse(
    sessionId: number
  ): __Observable<__StrictHttpResponse<Array<Utilisateurs>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl +
        `/api/sessions/${encodeURIComponent(String(sessionId))}/participants`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<Utilisateurs>>;
      })
    );
  }
  /**
   * @param sessionId undefined
   * @return successful operation
   */
  getParticipants(sessionId: number): __Observable<Array<Utilisateurs>> {
    return this.getParticipantsResponse(sessionId).pipe(
      __map((_r) => _r.body as Array<Utilisateurs>)
    );
  }

  /**
   * @return successful operation
   */
  findAll_3Response(): __Observable<__StrictHttpResponse<Array<ThemesDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/themes`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<ThemesDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findAll_3(): __Observable<Array<ThemesDto>> {
    return this.findAll_3Response().pipe(
      __map((_r) => _r.body as Array<ThemesDto>)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  save_2Response(
    body?: ThemesDto
  ): __Observable<__StrictHttpResponse<ThemesDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/themes`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ThemesDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  save_2(body?: ThemesDto): __Observable<ThemesDto> {
    return this.save_2Response(body).pipe(__map((_r) => _r.body as ThemesDto));
  }

  /**
   * @param name undefined
   * @return successful operation
   */
  themeExistsResponse(
    name: string
  ): __Observable<__StrictHttpResponse<boolean>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/themes/exists`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({
          body: (_r as HttpResponse<any>).body === 'true',
        }) as __StrictHttpResponse<boolean>;
      })
    );
  }
  /**
   * @param name undefined
   * @return successful operation
   */
  themeExists(name: string): __Observable<boolean> {
    return this.themeExistsResponse(name).pipe(
      __map((_r) => _r.body as boolean)
    );
  }

  /**
   * @param formationId undefined
   * @return successful operation
   */
  findThemesByFormationResponse(
    formationId: number
  ): __Observable<__StrictHttpResponse<Array<ThemesDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl +
        `/api/themes/formation/${encodeURIComponent(String(formationId))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<ThemesDto>>;
      })
    );
  }
  /**
   * @param formationId undefined
   * @return successful operation
   */
  findThemesByFormation(formationId: number): __Observable<Array<ThemesDto>> {
    return this.findThemesByFormationResponse(formationId).pipe(
      __map((_r) => _r.body as Array<ThemesDto>)
    );
  }

  /**
   * @param name undefined
   * @return successful operation
   */
  findByNameResponse(
    name: string
  ): __Observable<__StrictHttpResponse<Array<ThemesDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (name != null) __params = __params.set('name', name.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/themes/search`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<ThemesDto>>;
      })
    );
  }
  /**
   * @param name undefined
   * @return successful operation
   */
  findByName(name: string): __Observable<Array<ThemesDto>> {
    return this.findByNameResponse(name).pipe(
      __map((_r) => _r.body as Array<ThemesDto>)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findById_2Response(
    id: number
  ): __Observable<__StrictHttpResponse<ThemesDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/themes/${encodeURIComponent(String(id))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ThemesDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findById_2(id: number): __Observable<ThemesDto> {
    return this.findById_2Response(id).pipe(
      __map((_r) => _r.body as ThemesDto)
    );
  }

  /**
   * @param params The `ApiService.UpdateThemeParams` containing the following parameters:
   *
   * - `id`:
   *
   * - `body`:
   *
   * @return successful operation
   */
  updateThemeResponse(
    params: ApiService.UpdateThemeParams
  ): __Observable<__StrictHttpResponse<ThemesDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __body = params.body;
    let req = new HttpRequest<any>(
      'PUT',
      this.rootUrl + `/api/themes/${encodeURIComponent(String(params.id))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ThemesDto>;
      })
    );
  }
  /**
   * @param params The `ApiService.UpdateThemeParams` containing the following parameters:
   *
   * - `id`:
   *
   * - `body`:
   *
   * @return successful operation
   */
  updateTheme(params: ApiService.UpdateThemeParams): __Observable<ThemesDto> {
    return this.updateThemeResponse(params).pipe(
      __map((_r) => _r.body as ThemesDto)
    );
  }

  /**
   * @param id undefined
   */
  delete_2Response(id: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/api/themes/${encodeURIComponent(String(id))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param id undefined
   */
  delete_2(id: number): __Observable<null> {
    return this.delete_2Response(id).pipe(__map((_r) => _r.body as null));
  }

  /**
   * @param params The `ApiService.AssignThemeToFormationParams` containing the following parameters:
   *
   * - `themeId`:
   *
   * - `formationId`:
   *
   * @return successful operation
   */
  assignThemeToFormationResponse(
    params: ApiService.AssignThemeToFormationParams
  ): __Observable<__StrictHttpResponse<ThemesDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl +
        `/api/themes/${encodeURIComponent(
          String(params.themeId)
        )}/formation/${encodeURIComponent(String(params.formationId))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ThemesDto>;
      })
    );
  }
  /**
   * @param params The `ApiService.AssignThemeToFormationParams` containing the following parameters:
   *
   * - `themeId`:
   *
   * - `formationId`:
   *
   * @return successful operation
   */
  assignThemeToFormation(
    params: ApiService.AssignThemeToFormationParams
  ): __Observable<ThemesDto> {
    return this.assignThemeToFormationResponse(params).pipe(
      __map((_r) => _r.body as ThemesDto)
    );
  }

  /**
   * @return successful operation
   */
  findPersonnelCNIResponse(): __Observable<
    __StrictHttpResponse<Array<UtilisateursDto>>
  > {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/utilisateurs/Personnel_CNI`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<UtilisateursDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findPersonnelCNI(): __Observable<Array<UtilisateursDto>> {
    return this.findPersonnelCNIResponse().pipe(
      __map((_r) => _r.body as Array<UtilisateursDto>)
    );
  }

  /**
   * @return successful operation
   */
  findAdministrateursResponse(): __Observable<
    __StrictHttpResponse<Array<UtilisateursDto>>
  > {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/utilisateurs/administrateurs`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<UtilisateursDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findAdministrateurs(): __Observable<Array<UtilisateursDto>> {
    return this.findAdministrateursResponse().pipe(
      __map((_r) => _r.body as Array<UtilisateursDto>)
    );
  }

  /**
   * @return successful operation
   */
  findAll_4Response(): __Observable<
    __StrictHttpResponse<Array<UtilisateursDto>>
  > {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/utilisateurs/all`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<UtilisateursDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findAll_4(): __Observable<Array<UtilisateursDto>> {
    return this.findAll_4Response().pipe(
      __map((_r) => _r.body as Array<UtilisateursDto>)
    );
  }

  /**
   * @return successful operation
   */
  save_3Response(
    UtilisateursDto: any
  ): __Observable<__StrictHttpResponse<UtilisateursDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = UtilisateursDto;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/utilisateurs/create`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<UtilisateursDto>;
      })
    );
  }
  /**
   * @return successful operation
   */
  save_3(UtilisateursDto: any): __Observable<UtilisateursDto> {
    return this.save_3Response(UtilisateursDto).pipe(
      __map((_r) => _r.body as UtilisateursDto)
    );
  }
  delete_3Response(
    idUtilisateur: any
  ): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl +
        `/api/utilisateurs/delete/${encodeURIComponent(String(idUtilisateur))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  delete_3(idUtilisateur: any): __Observable<null> {
    return this.delete_3Response(idUtilisateur).pipe(
      __map((_r) => _r.body as null)
    );
  }

  /**
   * @return successful operation
   */
  findEtudiantsResponse(): __Observable<
    __StrictHttpResponse<Array<UtilisateursDto>>
  > {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/utilisateurs/etudiants`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<UtilisateursDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findEtudiants(): __Observable<Array<UtilisateursDto>> {
    return this.findEtudiantsResponse().pipe(
      __map((_r) => _r.body as Array<UtilisateursDto>)
    );
  }

  /**
   * @return successful operation
   */
  findByEmailResponse(
    email: any
  ): __Observable<__StrictHttpResponse<UtilisateursDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl +
        `/api/utilisateurs/find/${encodeURIComponent(String(email))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<UtilisateursDto>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findByEmail(email: any): __Observable<UtilisateursDto> {
    return this.findByEmailResponse(email).pipe(
      __map((_r) => _r.body as UtilisateursDto)
    );
  }

  /**
   * @return successful operation
   */
  findFormateurexterneResponse(): __Observable<
    __StrictHttpResponse<Array<UtilisateursDto>>
  > {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/utilisateurs/findFormateurexterne`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<UtilisateursDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findFormateurexterne(): __Observable<Array<UtilisateursDto>> {
    return this.findFormateurexterneResponse().pipe(
      __map((_r) => _r.body as Array<UtilisateursDto>)
    );
  }

  /**
   * @return successful operation
   */
  findFormateurinterneResponse(): __Observable<
    __StrictHttpResponse<Array<UtilisateursDto>>
  > {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/utilisateurs/findFormateurinternes`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<UtilisateursDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findFormateurinterne(): __Observable<Array<UtilisateursDto>> {
    return this.findFormateurinterneResponse().pipe(
      __map((_r) => _r.body as Array<UtilisateursDto>)
    );
  }

  /**
   * @return successful operation
   */
  findFormateurResponse(): __Observable<
    __StrictHttpResponse<Array<UtilisateursDto>>
  > {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/utilisateurs/formateurs`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<UtilisateursDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findFormateur(): __Observable<Array<UtilisateursDto>> {
    return this.findFormateurResponse().pipe(
      __map((_r) => _r.body as Array<UtilisateursDto>)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  getUtilisateurByInscriptionIdResponse(
    id: number
  ): __Observable<__StrictHttpResponse<UtilisateursDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl +
        `/api/utilisateurs/inscription/${encodeURIComponent(String(id))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<UtilisateursDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  getUtilisateurByInscriptionId(id: any): __Observable<UtilisateursDto> {
    return this.getUtilisateurByInscriptionIdResponse(id).pipe(
      __map((_r) => _r.body as UtilisateursDto)
    );
  }

  /**
   * @return successful operation
   */
  changerMotDePasseResponse(): __Observable<
    __StrictHttpResponse<UtilisateursDto>
  > {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/utilisateurs/update/password`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<UtilisateursDto>;
      })
    );
  }
  /**
   * @return successful operation
   */
  changerMotDePasse(): __Observable<UtilisateursDto> {
    return this.changerMotDePasseResponse().pipe(
      __map((_r) => _r.body as UtilisateursDto)
    );
  }
  /**
   * @param utilisateurId undefined
   * @return successful operation
   */
  getCertificatsByUserIdResponse(
    utilisateurId: number
  ): __Observable<__StrictHttpResponse<Array<CertificatsDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl +
        `/api/certificats/user/${encodeURIComponent(String(utilisateurId))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<CertificatsDto>>;
      })
    );
  }
  /**
   * @param utilisateurId undefined
   * @return successful operation
   */
  getCertificatsByUserId(
    utilisateurId: number
  ): __Observable<Array<CertificatsDto>> {
    return this.getCertificatsByUserIdResponse(utilisateurId).pipe(
      __map((_r) => _r.body as Array<CertificatsDto>)
    );
  }

  /**
   * @return successful operation
   */
  updateUtilisateursResponse(
    UtilisateursDto: any
  ): __Observable<__StrictHttpResponse<UtilisateursDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = UtilisateursDto;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/utilisateurs/updateUtilisateurs`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<UtilisateursDto>;
      })
    );
  }
  /**
   * @return successful operation
   */
  updateUtilisateurs(UtilisateursDto: any): __Observable<UtilisateursDto> {
    return this.updateUtilisateursResponse(UtilisateursDto).pipe(
      __map((_r) => _r.body as UtilisateursDto)
    );
  }

  /**
   * @return successful operation
   */
  findById_3Response(
    idUtilisateur: any
  ): __Observable<__StrictHttpResponse<UtilisateursDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl +
        `/api/utilisateurs/${encodeURIComponent(String(idUtilisateur))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<UtilisateursDto>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findById_3(idUtilisateur: any): __Observable<UtilisateursDto> {
    return this.findById_3Response(idUtilisateur).pipe(
      __map((_r) => _r.body as UtilisateursDto)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  genererCertificatResponse(
    body?: CertificatsDto
  ): __Observable<__StrictHttpResponse<CertificatsDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/generer`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CertificatsDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  genererCertificat(body?: CertificatsDto): __Observable<CertificatsDto> {
    return this.genererCertificatResponse(body).pipe(
      __map((_r) => _r.body as CertificatsDto)
    );
  }

  /**
   * @param numeroSerie undefined
   * @return successful operation
   */
  getCertificatByNumeroDeSerieResponse(
    numeroSerie: string
  ): __Observable<__StrictHttpResponse<CertificatsDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/numero/${encodeURIComponent(String(numeroSerie))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CertificatsDto>;
      })
    );
  }
  /**
   * @param numeroSerie undefined
   * @return successful operation
   */
  getCertificatByNumeroDeSerie(
    numeroSerie: string
  ): __Observable<CertificatsDto> {
    return this.getCertificatByNumeroDeSerieResponse(numeroSerie).pipe(
      __map((_r) => _r.body as CertificatsDto)
    );
  }

  /**
   * @param body Salle à sauvegarder
   * @return opération réussie
   */
  save_4Response(
    body?: SallesDto
  ): __Observable<__StrictHttpResponse<SallesDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = body;

    let req = new HttpRequest<any>('POST', this.rootUrl + `/save`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json',
    });

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => _r as __StrictHttpResponse<SallesDto>)
    );
  }

  /**
   * @param body Salle à sauvegarder
   * @return opération réussie
   */
  save_4(body?: SallesDto): __Observable<SallesDto> {
    return this.save_4Response(body).pipe(__map((_r) => _r.body as SallesDto));
  }

  /**
   * @param numeroSerie undefined
   */
  supprimerCertificatByNumeroDeSerieResponse(
    numeroSerie: string
  ): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl +
        `/supprimerCertificatByNumeroDeSerie/${encodeURIComponent(
          String(numeroSerie)
        )}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  supprimerCertificatByNumeroDeSerie(numeroSerie: string): __Observable<null> {
    return this.supprimerCertificatByNumeroDeSerieResponse(numeroSerie).pipe(
      __map((_r) => _r.body as null)
    );
  }

  /**
   * @param idUtilisateur undefined
   * @return successful operation
   */
  getCertificatByIdResponse(
    idUtilisateur: number
  ): __Observable<__StrictHttpResponse<CertificatsDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/${encodeURIComponent(String(idUtilisateur))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CertificatsDto>;
      })
    );
  }
  /**
   * @param idUtilisateur undefined
   * @return successful operation
   */
  getCertificatById(idUtilisateur: number): __Observable<CertificatsDto> {
    return this.getCertificatByIdResponse(idUtilisateur).pipe(
      __map((_r) => _r.body as CertificatsDto)
    );
  }

  /**
   * @param idUtilisateur undefined
   */
  supprimerCertificatResponse(
    idUtilisateur: number
  ): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/${encodeURIComponent(String(idUtilisateur))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param idUtilisateur undefined
   */
  supprimerCertificat(idUtilisateur: number): __Observable<null> {
    return this.supprimerCertificatResponse(idUtilisateur).pipe(
      __map((_r) => _r.body as null)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findById_4Response(
    id: number
  ): __Observable<__StrictHttpResponse<SallesDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/salles/${encodeURIComponent(String(id))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<SallesDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findById_4(id: any): __Observable<SallesDto> {
    return this.findById_4Response(id).pipe(
      __map((_r) => _r.body as SallesDto)
    );
  }

  /**
   * @param id undefined
   */
  delete_4Response(id: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    // Correction de l'URL pour inclure le chemin complet
    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/api/salles/${encodeURIComponent(String(id))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }

  /**
   * @param id undefined
   */
  delete_4(id: number): __Observable<null> {
    return this.delete_4Response(id).pipe(__map((_r) => _r.body as null));
  }
  /**
   * @return successful operation
   */
  authenticateResponse(): __Observable<
    __StrictHttpResponse<AuthenticationResponse>
  > {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/authentication/authenticate`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<AuthenticationResponse>;
      })
    );
  }
  /**
   * @return successful operation
   */
  authenticate(): __Observable<AuthenticationResponse> {
    return this.authenticateResponse().pipe(
      __map((_r) => _r.body as AuthenticationResponse)
    );
  }
  /**
   * @param userId undefined
   * @return successful operation
   */
  getFormationsByUserIdResponse(
    userId: number
  ): __Observable<__StrictHttpResponse<Array<FormationsDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl +
        `/api/formations/user/${encodeURIComponent(String(userId))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<FormationsDto>>;
      })
    );
  }
  /**
   * @param userId undefined
   * @return successful operation
   */
  getFormationsByUserId(userId: number): __Observable<Array<FormationsDto>> {
    return this.getFormationsByUserIdResponse(userId).pipe(
      __map((_r) => _r.body as Array<FormationsDto>)
    );
  }
  /**
   * @param formationId undefined
   * @return successful operation
   */
  findAvailableSessionsByFormationIdResponse(
    formationId: number
  ): __Observable<__StrictHttpResponse<Array<SessionsDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl +
        `/api/sessions/findAvailableSessionsByFormationId/${encodeURIComponent(
          String(formationId)
        )}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<SessionsDto>>;
      })
    );
  }
  /**
   * @param formationId undefined
   * @return successful operation
   */
  findAvailableSessionsByFormationId(
    formationId: number
  ): __Observable<Array<SessionsDto>> {
    return this.findAvailableSessionsByFormationIdResponse(formationId).pipe(
      __map((_r) => _r.body as Array<SessionsDto>)
    );
  }
  /**
   * @return successful operation
   */
  sendNotificationResponse(
    utilisateurId: number,
    contenu: string,
    statut: string = 'info', // Paramètre optionnel
    estLue: boolean = false, // Paramètre optionnel
    id: number = 0, // Id qui peut être fourni si nécessaire
    dateCreation: string = new Date().toISOString(), // Date de création dynamique
    dateEnvoi: string = new Date().toISOString() // Date d'envoi dynamique
  ): __Observable<__StrictHttpResponse<NotificationsDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = {
      id: id,
      utilisateurId: utilisateurId,
      contenu: contenu,
      dateCreation: dateCreation,
      dateEnvoi: dateEnvoi,
      statut: statut,
      estLue: estLue,
    };

    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/notifications/send`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<NotificationsDto>;
      })
    );
  }

  /**
   * @return successful operation
   */
  sendNotification(
    utilisateurId: number,
    contenu: string,
    statut: string = 'non spécifié', // Paramètre optionnel
    estLue: boolean = false, // Paramètre optionnel
    id: number = 0, // Id qui peut être fourni si nécessaire
    dateCreation: string = new Date().toISOString(), // Date de création dynamique
    dateEnvoi: string = new Date().toISOString() // Date d'envoi dynamique
  ): __Observable<NotificationsDto> {
    return this.sendNotificationResponse(utilisateurId, contenu).pipe(
      __map((_r) => _r.body as NotificationsDto)
    );
  }

  sendEmailResponse(
    destinataire: string,
    sujet: string,
    contenu: string
  ): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();

    // Préparer le corps avec les informations dynamiques
    let __body: any = {
      destinataire: destinataire,
      sujet: sujet,
      contenu: contenu,
    };

    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/notifications/send-email`,
      __body, // Envoi des données
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }

  sendEmail(
    destinataire: string,
    sujet: string,
    contenu: string
  ): __Observable<null> {
    return this.sendEmailResponse(destinataire, sujet, contenu).pipe(
      __map((_r) => _r.body as null)
    );
  }

  /**
   * @param params The `ApiService.UpdateCertificatStatusParams` containing the following parameters:
   *
   * - `nouveauStatut`:
   *
   * - `idCertificat`:
   */
  updateCertificatStatusResponse(
    params: ApiService.UpdateCertificatStatusParams
  ): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    // 💥 Ici on ajoute le nouveauStatut dans les paramètres d'URL
    if (params.nouveauStatut != null) {
      __params = __params.set('statut', params.nouveauStatut);
    }

    let req = new HttpRequest<any>(
      'PUT',
      this.rootUrl +
        `/api/certificats/updateStatus/${encodeURIComponent(
          String(params.idCertificat)
        )}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }

  /**
   * @param params The `ApiService.UpdateCertificatStatusParams` containing the following parameters:
   *
   * - `nouveauStatut`:
   *
   * - `idCertificat`:
   */
  updateCertificatStatus(
    params: ApiService.UpdateCertificatStatusParams
  ): __Observable<null> {
    return this.updateCertificatStatusResponse(params).pipe(
      __map((_r) => _r.body as null)
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  envoyerEmailResponse(
    body?: Email
  ): __Observable<__StrictHttpResponse<string>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/email/envoyer`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<string>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  envoyerEmail(body?: Email): __Observable<string> {
    return this.envoyerEmailResponse(body).pipe(
      __map((_r) => _r.body as string)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  envoyerEmailAvecPieceJointeResponse(
    formData: FormData
  ): __Observable<__StrictHttpResponse<string>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/email/envoyer-avec-piece-jointe`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<string>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  envoyerEmailAvecPieceJointe(formData: FormData): __Observable<string> {
    return this.envoyerEmailAvecPieceJointeResponse(formData).pipe(
      __map((_r) => _r.body as string)
    );
  }

  /**
   * @param params The `ApiService.EnvoyerEmailAvecTemplateParams` containing the following parameters:
   *
   * - `variables`:
   *
   * - `templateName`:
   *
   * - `body`:
   *
   * @return successful operation
   */
  envoyerEmailAvecTemplateResponse(
    params: ApiService.EnvoyerEmailAvecTemplateParams
  ): __Observable<__StrictHttpResponse<string>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.variables != null)
      __params = __params.set('variables', params.variables.toString());

    __body = params.body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl +
        `/api/email/envoyer-avec-template/${encodeURIComponent(
          String(params.templateName)
        )}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<string>;
      })
    );
  }
  /**
   * @param params The `ApiService.EnvoyerEmailAvecTemplateParams` containing the following parameters:
   *
   * - `variables`:
   *
   * - `templateName`:
   *
   * - `body`:
   *
   * @return successful operation
   */
  envoyerEmailAvecTemplate(
    params: ApiService.EnvoyerEmailAvecTemplateParams
  ): __Observable<string> {
    return this.envoyerEmailAvecTemplateResponse(params).pipe(
      __map((_r) => _r.body as string)
    );
  }
  /**
   * @param notificationId undefined
   */
  deleteNotificationResponse(
    notificationId: number
  ): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl +
        `/api/delete/${encodeURIComponent(String(notificationId))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param notificationId undefined
   */
  deleteNotification(notificationId: number): __Observable<null> {
    return this.deleteNotificationResponse(notificationId).pipe(
      __map((_r) => _r.body as null)
    );
  }
  /**
   * @param userId undefined
   * @return successful operation
   */
  getNotificationsByUserResponse(
    userId: number
  ): __Observable<__StrictHttpResponse<Array<Notifications>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/user/${encodeURIComponent(String(userId))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<Notifications>>;
      })
    );
  }
  /**
   * @param userId undefined
   * @return successful operation
   */
  getNotificationsByUser(userId: number): __Observable<Array<Notifications>> {
    return this.getNotificationsByUserResponse(userId).pipe(
      __map((_r) => _r.body as Array<Notifications>)
    );
  }
  /**
   * @return successful operation
   */
  createNotificationResponse(
    Notifications: Notifications
  ): __Observable<__StrictHttpResponse<Notifications>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/notifications/createNotification`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Notifications>;
      })
    );
  }
  /**
   * @return successful operation
   */
  createNotification(
    Notifications: Notifications
  ): __Observable<Notifications> {
    return this.createNotificationResponse(Notifications).pipe(
      __map((_r) => _r.body as Notifications)
    );
  }

  /**
   * @param params The `ApiService.AddUserToSessionParams` containing the following parameters:
   *
   * - `utilisateurId`:
   *
   * - `sessionId`:
   *
   * @return successful operation
   */
  addUserToSessionResponse(
    params: ApiService.AddUserToSessionParams
  ): __Observable<__StrictHttpResponse<SessionsDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl +
        `/api/sessions/addUserToSession/${encodeURIComponent(
          String(params.sessionId)
        )}/${encodeURIComponent(String(params.utilisateurId))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<SessionsDto>;
      })
    );
  }
  /**
   * @param params The `ApiService.AddUserToSessionParams` containing the following parameters:
   *
   * - `utilisateurId`:
   *
   * - `sessionId`:
   *
   * @return successful operation
   */
  addUserToSession(
    params: ApiService.AddUserToSessionParams
  ): __Observable<SessionsDto> {
    return this.addUserToSessionResponse(params).pipe(
      __map((_r) => _r.body as SessionsDto)
    );
  }
}

module ApiService {
  /**
   * Parameters for addUserToSession
   */
  export interface AddUserToSessionParams {
    utilisateurId: number;
    sessionId: number;
  }
  /**
   * Parameters for CoutsEmployesParPeriode
   */
  export interface CoutsEmployesParPeriodeParams {
    fin: string;
    debut: string;
  }
  export interface UpdateCertificatStatusParams {
    idCertificat: number;
    nouveauStatut: string;
  }
  /**
   * Parameters for CoutsFormateursParPeriode
   */
  export interface CoutsFormateursParPeriodeParams {
    fin: string;
    debut: string;
  }

  /**
   * Parameters for calculerProfitTotal
   */
  export interface CalculerProfitTotalParams {
    fin: string;
    debut: string;
  }

  /**
   * Parameters for ChiffreAffaireEtudiantParPeriode
   */
  export interface ChiffreAffaireEtudiantParPeriodeParams {
    fin: string;
    debut: string;
  }

  /**
   * Parameters for findByDateBetween
   */
  export interface FindByDateBetweenParams {
    startDate: string;
    endDate: string;
  }

  /**
   * Parameters for updateTheme
   */
  export interface UpdateThemeParams {
    id: number;
    body?: ThemesDto;
  }

  /**
   * Parameters for assignThemeToFormation
   */
  export interface AssignThemeToFormationParams {
    themeId: number;
    formationId: number;
  }
  /**
   * Parameters for predictCustom
   */
  export interface PredictCustomParams {
    nombreHeuresFormation: number;
    nombreFormations: number;
    nombreEmployes: number;
    nombreClients: number;
  }
  /**
   * Parameters for aggregateFinancialData
   */
  export interface AggregateFinancialDataParams {
    startDate: string;
    endDate: string;
  }
  /**
   * Parameters for getFinancialByPeriod
   */
  export interface GetFinancialByPeriodParams {
    fin: string;
    debut: string;
  }
  /**
   * Parameters for envoyerEmailAvecTemplate
   */
  export interface EnvoyerEmailAvecTemplateParams {
    variables: any;
    templateName: string;
    body?: Email;
  }
}

export { ApiService };
