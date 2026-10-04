package CNI.Crud.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import CNI.Crud.Model.Formations;
import jakarta.validation.constraints.NotNull;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormationsDto {

    private Integer id;
    private String titre;
    private String description;
    private Integer duree;
    private Double prix;
    private String niveau;
    private String prerequis;
    private String statut;
    private Integer placesMax;
    private String objectifsFormation;
    private String photo;
    private String programmeDetaille;

    @NotNull(message = "Le thème est obligatoire")
    private Integer themeId;

    // Méthodes de conversion entre l'entité et le DTO
    public static FormationsDto fromEntity(Formations formation) {
        if (formation == null) {
            return null;
        }

        return FormationsDto.builder()
                .id(formation.getId())
                .titre(formation.getTitre())
                .description(formation.getDescription())
                .photo(formation.getPhoto())
                .duree(formation.getDuree())
                .prix(formation.getPrix())
                .niveau(formation.getNiveau())
                .prerequis(formation.getPrerequis())
                .statut(formation.getStatut())
                .placesMax(formation.getPlacesMax())
                .objectifsFormation(formation.getObjectifsFormation())
                .programmeDetaille(formation.getProgrammeDetaille())
              .themeId(formation.getTheme() != null ? formation.getTheme().getId() : null)
                .build();
    }

    public static Formations toEntity(FormationsDto dto) {
        if (dto == null) {
            return null;
        }

        Formations formation = new Formations();
        formation.setId(dto.getId());
        formation.setTitre(dto.getTitre());
        formation.setDescription(dto.getDescription());
        formation.setPhoto(dto.getPhoto());
        formation.setDuree(dto.getDuree());
        formation.setPrix(dto.getPrix());
        formation.setNiveau(dto.getNiveau());
        formation.setPrerequis(dto.getPrerequis());
        formation.setStatut(dto.getStatut());
        formation.setPlacesMax(dto.getPlacesMax());
        formation.setObjectifsFormation(dto.getObjectifsFormation());
        formation.setProgrammeDetaille(dto.getProgrammeDetaille());

        return formation;
    }
}
