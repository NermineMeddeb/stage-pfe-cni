/* tslint:disable */
export interface Email {
  contenu?: string;
  destinataire?: string;
  destinatairesBcc?: Array<string>;
  destinatairesCc?: Array<string>;
  estHtml?: boolean;
  id?: number;
  pieceJointe?: Array<string>;
  sujet?: string;
}
