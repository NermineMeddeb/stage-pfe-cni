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
import { UtilisateursDto } from '../models';
import { ChangerMotDePasseUtilisateurDto } from '../models/ChangerMotDePasseUtilisateurDto';

@Injectable({
  providedIn: 'root',
})
class UtilisateursService extends __BaseService {
  static readonly changerMotDePassePath =
    '/gestiondestock/v1/utilisateurs/update/password';
  static readonly findByIdPath =
    '/gestiondestock/v1/utilisateurs/{idUtilisateur}';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  changerMotDePasseResponse(
    body?: ChangerMotDePasseUtilisateurDto
  ): __Observable<__StrictHttpResponse<UtilisateursDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/gestiondestock/v1/utilisateurs/update/password`,
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

  //       decomentiha men ba3ed
  changerMotDePasse(
    body?: ChangerMotDePasseUtilisateurDto
  ): __Observable<UtilisateursDto> {
    return this.changerMotDePasseResponse(body).pipe(
      __map((_r) => _r.body as UtilisateursDto)
    );
  }

  /**
   * @param idUtilisateur undefined
   * @return successful operation
   */
  findByIdResponse(
    idUtilisateur: number
  ): __Observable<__StrictHttpResponse<UtilisateursDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/utilisateurs/${idUtilisateur}`,
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
   * @param idUtilisateur undefined
   * @return successful operation
   */
  findById(idUtilisateur: number): __Observable<UtilisateursDto> {
    return this.findByIdResponse(idUtilisateur).pipe(
      __map((_r) => _r.body as UtilisateursDto)
    );
  }
}

module UtilisateursService {}

export { UtilisateursService };
