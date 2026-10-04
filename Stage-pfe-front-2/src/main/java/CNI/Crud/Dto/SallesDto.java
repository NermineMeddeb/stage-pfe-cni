
  package CNI.Crud.Dto;
  
 
  import CNI.Crud.Model.Salles;
import lombok.Builder;
  import lombok.Data;
  @Data
  
  @Builder
  public class SallesDto {
  
  private Integer id;
  
  private String nom;
  private Integer capacite;
  private String equipement;
  private String statut;
  
  
  public static SallesDto fromEntity(Salles salle) {
  if (salle == null) {
  return null;
  }
  
  return SallesDto.builder()
  .id(salle.getId())
  .nom(salle.getNom())
  .capacite(salle.getCapacite())
  .equipement(salle.getEquipement())
  .statut(salle.getStatut())
  .build();
  }
  
  
  public static Salles toEntity(SallesDto dto) {
  if (dto == null) {
  return null;
  }
  
  Salles salle = new Salles();
  salle.setId(dto.getId());
  salle.setNom(dto.getNom());
  salle.setCapacite(dto.getCapacite());
  salle.setEquipement(dto.getEquipement());
  salle.setStatut(dto.getStatut());
  return salle;
  }
 }
 