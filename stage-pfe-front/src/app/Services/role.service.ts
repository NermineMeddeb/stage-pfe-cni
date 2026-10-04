import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  UtilisateursDto } from 'src/cni-api/src/models';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private baseUrl = 'http://localhost:8080/api'; // Assurez-vous que cette URL est correcte

  constructor(private http: HttpClient) {}

  save_3(client: UtilisateursDto): Observable<UtilisateursDto> {
    return this.http.post<UtilisateursDto>(`${this.baseUrl}/utilisateurs/create`, client);
  }

 
}