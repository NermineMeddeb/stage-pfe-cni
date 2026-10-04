package CNI.Crud.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

import CNI.Crud.Model.Certificats;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificatsDto {

    private Integer inscriptionId;
    private Integer id;
    private LocalDate dateGeneration;
    private String numeroSerie;
    private String statut;
    private String file_url;

    public static CertificatsDto fromEntity(Certificats certificat) {
        if (certificat == null) {
            return null;
        }

        return CertificatsDto.builder()
                .inscriptionId(certificat.getInscription() != null ? certificat.getInscription().getId() : null)
                .dateGeneration(certificat.getDateGeneration())
                .statut(certificat.getStatut())
                .id(certificat.getId())
                .numeroSerie(certificat.getNumeroSerie())
                .file_url(certificat.getFile_url())

                .build();
    }

    public static Certificats toEntity(CertificatsDto dto) {
        if (dto == null) {
            return null;
        }

        Certificats certificat = new Certificats();
        certificat.setDateGeneration(dto.getDateGeneration());
        certificat.setStatut(dto.getStatut());
        certificat.setNumeroSerie(dto.getNumeroSerie());
        certificat.setId(dto.getId());

        certificat.setFile_url(dto.getFile_url());

        return certificat;
    }
}
