/* tslint:disable */
import { Utilisateurs } from './utilisateurs';
export interface Notifications {
  contenu?: string;
  dateCreation?: string;
  dateEnvoi?: string;
  estLue?: boolean;
  id?: number;
  statut?: string;
  utilisateur?: Utilisateurs;
}
