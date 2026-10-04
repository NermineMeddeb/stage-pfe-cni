/* package stage_pfe.cni.gestion_centre_formation.Dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import stage_pfe.cni.gestion_centre_formation.Model.Themes;

import java.util.List;
import java.util.stream.Collectors;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThemesDto {

    private Integer id;

    @NotNull(message = "Le nom du thème ne doit pas être nul")
    @Size(max = 100, message = "Le nom du thème ne doit pas dépasser 100 caractères")
    private String nom;

    private List<Integer> formationsIds;

   
    public static ThemesDto fromEntity(Themes theme) {
        if (theme == null) {
            return null;
        }

        return ThemesDto.builder()
                .id(theme.getId())
                .nom(theme.getNom())
            
                 .formationsIds(
                 theme.getFormations() != null
                  ? theme.getFormations().stream()
                 .map(formation -> formation.getId())
                  .collect(Collectors.toList())
                  : null
                  )
                  .build();
    }

    public static Themes toEntity(ThemesDto dto) {
        if (dto == null) {
            return null;
        }

        Themes theme = new Themes();
        theme.setId(dto.getId());
        theme.setNom(dto.getNom());
        // Les formations doivent être gérées séparément pour établir les relations.
        return theme;
    }
}
 */