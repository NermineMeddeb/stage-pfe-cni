/* tslint:disable */
export interface Utilisateurs {
  cin?: string;
  dateNaissance?: string;
  email?: string;
  etablissement?: string;
  id?: number;
  motDePasse?: string;
  nom?: string;
  photo?: string;
  prenom?: string;
  role?: 'EXTERNE' | 'INTERNE' | 'ETUDIANT' | 'ADMIN' | 'EMPLOYEE';
  telephone?: string;
}
