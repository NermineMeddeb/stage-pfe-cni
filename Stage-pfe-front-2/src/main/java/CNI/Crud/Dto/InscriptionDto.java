package CNI.Crud.Dto;

import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import CNI.Crud.Model.Inscription;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InscriptionDto {
  private Integer id;
  private Integer sessionId;
  private LocalDate dateInscription;
  private String statut;
  private Boolean certificatGenere;
  private LocalDate dateDebut;
  private LocalDate dateFin;

  public static InscriptionDto fromEntity(Inscription inscription) {
    if (inscription == null) {
      return null;
    }

    return InscriptionDto.builder()
        .id(inscription.getId())
        .sessionId(inscription.getSession() != null ? inscription.getSession().getId() : null)
        .dateInscription(inscription.getDateInscription())
        .statut(inscription.getStatut())
        .certificatGenere(inscription.getCertificatGenere())
        .dateDebut(inscription.getDatedebut())
        .dateFin(inscription.getDateFin())
        .build();
  }

  public static Inscription toEntity(InscriptionDto dto) {
    if (dto == null) {
      return null;
    }

    Inscription inscription = new Inscription();
    inscription.setId(dto.getId());
    inscription.setDateInscription(dto.getDateInscription());
    inscription.setStatut(dto.getStatut());
    inscription.setCertificatGenere(dto.getCertificatGenere());
    inscription.setDatedebut(dto.getDateDebut());
    inscription.setDateFin(dto.getDateFin());
    return inscription;
  }
}