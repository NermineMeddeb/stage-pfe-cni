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
import { CommentairesDto } from '../models/commentaires-dto';
import { FormationsDto } from '../models/formations-dto';
import { InscriptionDto } from '../models/inscription-dto';
import { SessionsDto } from '../models/sessions-dto';
import { Utilisateurs } from '../models/utilisateurs';
import { ThemesDto } from '../models/themes-dto';
import { UtilisateursDto } from '../models/utilisateurs-dto';
import { CertificatsDto } from '../models/certificats-dto';
@Injectable({
  providedIn: 'root',
})
class ApiService extends __BaseService {
  static readonly getAllSallesPath = '/all';
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
  static readonly findAll_1Path = '/api/inscriptions/all';
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
  static readonly changerMotDePassePath = '/api/utilisateurs/update/password';
  static readonly findById_3Path = '/api/utilisateurs/{idUtilisateur}';
  static readonly getAllCertificatsPath = '/certificats';
  static readonly genererCertificatPath = '/certificats';
  static readonly getCertificatByIdPath = '/certificats/{idUtilisateur}';
  static readonly supprimerCertificatPath = '/certificats/{idUtilisateur}';
  static readonly save_4Path = '/save';
  static readonly findById_4Path = '/{id}';
  static readonly delete_4Path = '/{id}';

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
    let req = new HttpRequest<any>('GET', this.rootUrl + `/all`, __body, {
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
  findAllResponse(): __Observable<
    __StrictHttpResponse<Array<CommentairesDto>>
  > {
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
        return _r as __StrictHttpResponse<Array<CommentairesDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findAll(): __Observable<Array<CommentairesDto>> {
    return this.findAllResponse().pipe(
      __map((_r) => _r.body as Array<CommentairesDto>)
    );
  }

  /**
   * @return successful operation
   */
  saveResponse(): __Observable<__StrictHttpResponse<CommentairesDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
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
        return _r as __StrictHttpResponse<CommentairesDto>;
      })
    );
  }
  /**
   * @return successful operation
   */
  save(): __Observable<CommentairesDto> {
    return this.saveResponse().pipe(__map((_r) => _r.body as CommentairesDto));
  }

  /**
   * @return successful operation
   */
  findByIdResponse(
    id: any
  ): __Observable<__StrictHttpResponse<CommentairesDto>> {
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
        return _r as __StrictHttpResponse<CommentairesDto>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findById(id: any): __Observable<CommentairesDto> {
    return this.findByIdResponse(id).pipe(
      __map((_r) => _r.body as CommentairesDto)
    );
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
    FormationsDto: any
  ): __Observable<__StrictHttpResponse<FormationsDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = FormationsDto;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/formations/save`,
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
  saveFormation(FormationsDto: any): __Observable<FormationsDto> {
    return this.saveFormationResponse(FormationsDto).pipe(
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
  updatesessionsResponse(): __Observable<__StrictHttpResponse<SessionsDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
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
  updatesessions(): __Observable<SessionsDto> {
    return this.updatesessionsResponse().pipe(
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
  findById_1(id: number): __Observable<SessionsDto> {
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
  delete_1(id: number): __Observable<null> {
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
    let __body: any = null;
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
      this.rootUrl + `/certificats`,
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
      this.rootUrl + `/certificats`,
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
      this.rootUrl +
        `/certificats/${encodeURIComponent(String(idUtilisateur))}`,
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
    idUtilisateur: any
  ): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl +
        `/certificats/${encodeURIComponent(String(idUtilisateur))}`,
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
  supprimerCertificat(idUtilisateur: any): __Observable<null> {
    return this.supprimerCertificatResponse(idUtilisateur).pipe(
      __map((_r) => _r.body as null)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  save_4Response(
    body?: SallesDto
  ): __Observable<__StrictHttpResponse<SallesDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>('POST', this.rootUrl + `/save`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json',
    });

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<SallesDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  save_4(body?: SallesDto): __Observable<SallesDto> {
    return this.save_4Response(body).pipe(__map((_r) => _r.body as SallesDto));
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findById_4Response(
    id: any
  ): __Observable<__StrictHttpResponse<SallesDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/${encodeURIComponent(String(id))}`,
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

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/${encodeURIComponent(String(id))}`,
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
}

module ApiService {
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
}

export { ApiService };
