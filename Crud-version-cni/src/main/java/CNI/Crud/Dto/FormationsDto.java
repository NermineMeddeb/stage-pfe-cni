package CNI.Crud.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// Remplacez cet import par celui de votre entité Theme si elle existe dans votre modèle
import CNI.Crud.Model.Themes;
import CNI.Crud.Model.Formations;

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

    private Integer themeId;

    // Méthode de conversion de l'entité au DTO
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

    // Méthode de conversion du DTO vers l'entité
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

        // Associer le thème à partir de l'ID fourni
        if (dto.getThemeId() != null) {
            Themes theme = new Themes();
            theme.setId(dto.getThemeId());
            formation.setTheme(theme);
        }
        return formation;
    }
}
