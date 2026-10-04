/* tslint:disable */
import { RolesDto } from './roles-dto';
export interface UtilisateursDto {
  adresse?: string;
  dateNaissance?: string;
  email?: string;
  id?: number;
  motDePasse?: string;
  nom?: string;
  photo?: string;
  prenom?: string;
  roles?: Array<RolesDto>;
  telephone?: string;
}
