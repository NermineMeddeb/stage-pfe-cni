/* package stage_pfe.cni.gestion_centre_formation.Dto;

import stage_pfe.cni.gestion_centre_formation.Model.Certificats;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificatsDto {

    private Integer inscriptionId; // Seul l'ID est stocké pour éviter les références circulaires.
    private LocalDate dateGeneration;
    private String numeroSerie;
    private String statut;

    public static CertificatsDto fromEntity(Certificats certificat) {
        if (certificat == null) {
            return null;
        }

        return CertificatsDto.builder()
                .inscriptionId(certificat.getInscription() != null ? certificat.getInscription().getId() : null)
                .dateGeneration(certificat.getDateGeneration())
                .statut(certificat.getStatut())
                .build();
    }

   
    public static Certificats toEntity(CertificatsDto dto) {
        if (dto == null) {
            return null;
        }

        Certificats certificat = new Certificats();
        certificat.setDateGeneration(dto.getDateGeneration());
        certificat.setStatut(dto.getStatut());

        // L'entité Inscription ne peut pas être définie ici directement (doit être chargée depuis le service).
        return certificat;
    }
}
  */