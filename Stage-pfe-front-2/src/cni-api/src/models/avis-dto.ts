/* tslint:disable */
export interface AvisDto {
  besoinsFormation?: string;
  dateFormation?: string;
  evaluationEnvironnement?: number;
  evaluationFormateur?: number;
  evaluationFormation?: number;
  evaluationMoyens?: number;
  formateurIds?: Array<number>;
  id?: number;
  lieuFormation?: string;
  noteGlobale?: number;
  nouveauxBesoinFormation?: boolean;
  responsableEmail?: string;
  responsableNom?: string;
  responsableTel?: string;
  sessionsId?: number;
  suggestions?: string;
  utilisateursId?: number;
}
