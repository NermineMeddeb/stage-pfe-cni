package stage_pfe.cni.gestion_centre_formation.Controller.Api;

import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import stage_pfe.cni.gestion_centre_formation.Dto.FormationsDto;

import java.time.LocalDate;
import java.util.List;

@RequestMapping("/api/formations")
public interface FormationsApi {

    @Operation(summary = "Enregistrer une nouvelle formation", description = "Cette méthode permet d'enregistrer une nouvelle formation dans le système.")
    @PostMapping("/save")
    FormationsDto save(@RequestBody FormationsDto dto);

    @Operation(summary = "Récupérer une formation par son ID", description = "Cette méthode permet de récupérer une formation spécifique à partir de son identifiant unique.")
    @GetMapping("/id/{id}")
    FormationsDto findById(@PathVariable Long id);

    @Operation(summary = "Récupérer les formations par statut", description = "Cette méthode permet de récupérer la liste des formations selon leur statut.")
    @GetMapping("/statut/{statut}")
    List<FormationsDto> findByStatut(@PathVariable String statut);

    @Operation(summary = "Récupérer toutes les formations", description = "Cette méthode permet de récupérer toutes les formations enregistrées dans le système.")
    @GetMapping("/all")
    List<FormationsDto> findAll();
/* 
    @Operation(summary = "Récupérer les formations par thème", description = "Cette méthode permet de récupérer une liste de formations filtrées par leur thème.")
    @GetMapping("/theme/{themeId}")
    List<FormationsDto> findByThemeId(@PathVariable Long themeId); */

    @Operation(summary = "Récupérer les formations par niveau", description = "Cette méthode permet de récupérer les formations en fonction de leur niveau.")
    @GetMapping("/niveau/{niveau}")
    List<FormationsDto> findByNiveau(@PathVariable String niveau);

    @Operation(summary = "Récupérer les formations par plage de prix", description = "Cette méthode permet de récupérer les formations dont le prix est compris dans la plage spécifiée.")
    @GetMapping("/prix")
    List<FormationsDto> findByPrixBetween(@RequestParam Double minPrix, @RequestParam Double maxPrix);

    @Operation(summary = "Rechercher des formations", description = "Cette méthode permet de rechercher des formations en fonction d'un mot-clé spécifié.")
    @GetMapping("/search")
    List<FormationsDto> searchFormations(@RequestParam String keyword);

    @Operation(summary = "Supprimer une formation", description = "Cette méthode permet de supprimer une formation en fonction de son identifiant.")
    @DeleteMapping("/delete/{id}")
    void delete(@PathVariable Long id);

    @Operation(summary = "Compter le nombre total de formations", description = "Cette méthode permet de récupérer le nombre total de formations enregistrées dans le système.")
    @GetMapping("/formations/count")
    long countFormations();

    /*
     * Si ces méthodes sont nécessaires plus tard, elles peuvent être réactivées.
     * 
     * @GetMapping("/available/{id}")
     * boolean isFormationAvailable(@PathVariable Long id,
     * 
     * @RequestParam LocalDate startDate,
     * 
     * @RequestParam LocalDate endDate);
     * 
     * @DeleteMapping("/deleteOldCancelled")
     * void deleteOldCancelledFormations(@RequestParam LocalDate date);
     */
}
