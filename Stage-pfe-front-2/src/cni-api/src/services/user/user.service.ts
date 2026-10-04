import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationResponse, UtilisateursDto } from '../../models';
import { UtilisateursService } from '../UtilisateurService copy';
import { ChangerMotDePasseUtilisateurDto } from '../../models/ChangerMotDePasseUtilisateurDto';
import { ApiService } from '../api.service';
import { AuthenticationRequest } from '../../models/authentication-request';
import { AuthenticationService } from '../AuthenticationService';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private authenticationService: AuthenticationService,
    private utilisateurService: UtilisateursService,
    private ApiService: ApiService,
    private router: Router
  ) {}

  findUtilisateurById(id: number): Observable<UtilisateursDto> {
    if (id) {
      return this.utilisateurService.findById(id);
    }
    return of();
  }

  login(
    authenticationRequest: AuthenticationRequest
  ): Observable<AuthenticationResponse> {
    return this.authenticationService.authenticate(authenticationRequest);
  }

  getUserByEmail(email?: string): Observable<UtilisateursDto> {
    if (email) {
      return this.ApiService.findByEmail(email);
    }
    return of();
  }

  setAccessToken(authenticationResponse: AuthenticationResponse): void {
    localStorage.setItem('accessToken', JSON.stringify(authenticationResponse));
  }

  setConnectedUser(utilisateur: UtilisateursDto): void {
    localStorage.setItem('connectedUser', JSON.stringify(utilisateur));
  }

  getConnectedUser(): UtilisateursDto {
    const userJson = localStorage.getItem('connectedUser');
    if (userJson) {
      return JSON.parse(userJson) as UtilisateursDto;
    }
    return {}; // Renvoie un objet vide si aucun utilisateur n'est connecté
  }

  changerMotDePasse(
    changerMotDePasseDto: ChangerMotDePasseUtilisateurDto
  ): Observable<ChangerMotDePasseUtilisateurDto> {
    return this.utilisateurService.changerMotDePasse(changerMotDePasseDto);
  }

  isUserLoggedAndAccessTokenValid(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // TODO : Ajouter la validation de l'accessToken si nécessaire
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }
}
