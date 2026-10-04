
package CNI.Crud.Dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

import CNI.Crud.Model.Formations;
import CNI.Crud.Model.Paiements;
import CNI.Crud.Model.Utilisateurs;

@Data

@Builder
public class PaiementsDto {

    private Integer id;
    private Integer utilisateurId;
    private Integer formationId;
    private Double montant;
    private LocalDateTime datePaiement;
    private String statut;
    private String modePaiement;

    public static PaiementsDto fromEntity(Paiements paiements) {
        if (paiements == null) {
            return null;
        }

        return PaiementsDto.builder()
                .id(paiements.getId())
                .utilisateurId(paiements.getUtilisateur() != null ? paiements.getUtilisateur().getId() : null)
                .formationId(paiements.getFormation() != null ? paiements.getFormation().getId() : null)
                .montant(paiements.getMontant())
                .datePaiement(paiements.getDatePaiement())
                .statut(paiements.getStatut())
                .modePaiement(paiements.getModePaiement())
                .build();
    }

    public static Paiements toEntity(PaiementsDto dto, Utilisateurs utilisateur,
            Formations formation) {
        if (dto == null) {
            return null;
        }

        Paiements paiements = new Paiements();
        paiements.setId(dto.getId());
        paiements.setUtilisateur(utilisateur);
        paiements.setFormation(formation);
        paiements.setMontant(dto.getMontant());
        paiements.setDatePaiement(dto.getDatePaiement());
        paiements.setStatut(dto.getStatut());
        paiements.setModePaiement(dto.getModePaiement());
        return paiements;
    }
}
