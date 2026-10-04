/* package stage_pfe.cni.gestion_centre_formation.Controller.Api;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import stage_pfe.cni.gestion_centre_formation.Dto.SessionsDto;
import stage_pfe.cni.gestion_centre_formation.Dto.ThemesDto;

public interface ThemesApi {

    @Operation(summary = "Enregistrer un thème", description = "Cette méthode permet de créer un nouveau thème en envoyant les données sous forme d'objet ThemesDto.")
    @PostMapping
    ThemesDto save(@RequestBody ThemesDto dto);

    @Operation(summary = "Récupérer un thème par ID", description = "Cette méthode permet de récupérer un thème spécifique en fonction de son identifiant.")
    @GetMapping("/{id}")
    ThemesDto findById(@PathVariable Long id);

    @Operation(summary = "Lister tous les thèmes", description = "Cette méthode permet de récupérer la liste complète des thèmes disponibles.")
    @GetMapping
    List<ThemesDto> findAll();

    @Operation(summary = "Rechercher un thème par nom", description = "Cette méthode permet de rechercher des thèmes en fonction d'un nom donné.")
    @GetMapping("/search")
    List<ThemesDto> findByName(@RequestParam String name);

    @Operation(summary = "Assigner un thème à une formation", description = "Cette méthode permet d'associer un thème à une formation donnée en utilisant leurs identifiants respectifs.")
    @PostMapping("/{themeId}/formation/{formationId}")
    ThemesDto assignThemeToFormation(@PathVariable Long themeId, @PathVariable Long formationId);

    @Operation(summary = "Récupérer les thèmes associés à une formation", description = "Cette méthode permet de récupérer tous les thèmes associés à une formation spécifique en fonction de l'ID de la formation.")
    @GetMapping("/formation/{formationId}")
    List<ThemesDto> findThemesByFormation(@PathVariable Long formationId);

    @Operation(summary = "Mettre à jour un thème", description = "Cette méthode permet de mettre à jour un thème existant en envoyant les nouvelles données sous forme d'objet ThemesDto.")
    @PutMapping("/{id}")
    ThemesDto updateTheme(@PathVariable Long id, @RequestBody ThemesDto dto);

    @Operation(summary = "Supprimer un thème", description = "Cette méthode permet de supprimer un thème existant du système en fonction de son ID.")
    @DeleteMapping("/{id}")
    void delete(@PathVariable Long id);

    @Operation(summary = "Vérifier si un thème existe", description = "Cette méthode permet de vérifier si un thème existe dans le système en fonction de son nom.")
    @GetMapping("/exists")
    Boolean themeExists(@RequestParam String name);
}
 */