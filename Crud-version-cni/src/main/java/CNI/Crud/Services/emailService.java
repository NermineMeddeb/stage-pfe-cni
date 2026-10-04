package CNI.Crud.Services;

import CNI.Crud.Model.email;

public interface emailService {
    /**
     * Envoie un email simple
     * 
     * @param emailDetails détails de l'email à envoyer
     * @return statut de l'envoi
     */
    String envoyerEmail(email emailDetails);

    /**
     * Envoie un email avec pièce jointe
     * 
     * @param emailDetails détails de l'email avec pièce jointe
     * @return statut de l'envoi
     */
    String envoyerEmailAvecPieceJointe(email emailDetails);

    /**
     * Envoie un email avec template
     * 
     * @param emailDetails détails de l'email
     * @param templateName nom du template à utiliser
     * @param variables    variables à utiliser dans le template
     * @return statut de l'envoi
     */
    String envoyerEmailAvecTemplate(email emailDetails, String templateName, Object variables);
}
