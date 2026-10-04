
package CNI.Crud.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

import CNI.Crud.Model.Formations;
import CNI.Crud.Model.Paiements;
import CNI.Crud.Model.Sessions;
import CNI.Crud.Model.Utilisateurs;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class PaiementsDto {

    private Integer id;
    private Integer utilisateurId;
    private Integer SessionsId;
    private Double montant;
    private LocalDate datePaiement;
    private String statut;
    private String modePaiement;

    public static PaiementsDto fromEntity(Paiements paiements) {
        if (paiements == null) {
            return null;
        }

        return PaiementsDto.builder()
                .id(paiements.getId())
                .utilisateurId(paiements.getUtilisateur() != null ? paiements.getUtilisateur().getId() : null)
                .SessionsId(paiements.getSessions() != null ? paiements.getSessions().getId() : null)
                .montant(paiements.getMontant())
                .datePaiement(paiements.getDatePaiement())
                .statut(paiements.getStatut())
                .modePaiement(paiements.getModePaiement())
                .build();
    }

    public static Paiements toEntity(PaiementsDto dto, Utilisateurs utilisateur,
            Sessions sessions) {
        if (dto == null) {
            return null;
        }

        Paiements paiements = new Paiements();
        paiements.setId(dto.getId());
        paiements.setUtilisateur(utilisateur);
        paiements.setSessions(sessions);
        paiements.setMontant(dto.getMontant());
        paiements.setDatePaiement(dto.getDatePaiement());
        paiements.setStatut(dto.getStatut());
        paiements.setModePaiement(dto.getModePaiement());
        return paiements;
    }
}
