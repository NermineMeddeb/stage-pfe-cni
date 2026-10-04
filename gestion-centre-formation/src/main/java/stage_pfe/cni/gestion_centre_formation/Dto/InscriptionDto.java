package stage_pfe.cni.gestion_centre_formation.Dto;
/* 
import lombok.Builder;
import lombok.Data;
import stage_pfe.cni.gestion_centre_formation.Model.Inscription;
import stage_pfe.cni.gestion_centre_formation.Model.Sessions;
import stage_pfe.cni.gestion_centre_formation.Model.Utilisateurs;

import java.time.LocalDate;

@Data
@Builder
public class InscriptionDto {

    private Integer id;
    private Integer etudiantId;
    private Integer sessionId;
    private LocalDate dateInscription;
    private String statut;
    private Integer noteFinale;
    private Boolean certificatGenere;

  
    public static InscriptionDto fromEntity(Inscription inscription) {
        if (inscription == null) {
            return null;
        }

        return InscriptionDto.builder()
                .id(inscription.getId())
                // .etudiantId(inscription.getUtilisateur() != null ?
                // inscription.getUtilisateur().getId() : null)
                // .sessionId(inscription.getSession() != null ?
                // inscription.getSession().getSessionId() : null)
                .dateInscription(inscription.getDateInscription())
                .statut(inscription.getStatut())
                .certificatGenere(inscription.getCertificatGenere())
                .build();
    }

    
    public static Inscription toEntity(InscriptionDto dto, Utilisateurs etudiant, Sessions session) {
        if (dto == null) {
            return null;
        }

        Inscription inscription = new Inscription();
        inscription.setId(dto.getId());
        // inscription.setUtilisateur(etudiant);
        // inscription.setSession(session);
        inscription.setDateInscription(dto.getDateInscription());
        inscription.setStatut(dto.getStatut());
        inscription.setCertificatGenere(dto.getCertificatGenere());
        return inscription;
    }
}
 */