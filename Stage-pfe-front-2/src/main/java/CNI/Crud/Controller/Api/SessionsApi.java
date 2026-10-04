
package CNI.Crud.Controller.Api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import CNI.Crud.Dto.SessionsDto;
import io.swagger.v3.oas.annotations.Operation;

import java.time.LocalDate;
import java.util.List;

@RequestMapping("/api/sessions")
public interface SessionsApi {

    @Operation(summary = "Enregistrer une nouvelle formation", description = "Cette méthode permet d'enregistrer une nouvelle formation dans le système.")

    @PostMapping("/save")
    SessionsDto save(@RequestBody SessionsDto dto);

    @Operation(summary = "Rechercher une session par ID", description = "Cette méthode permet de récupérer les détails d'une session spécifique en fonction de son identifiant.")

    @GetMapping("/{id}")
    SessionsDto findById(@PathVariable Long id);

    @Operation(summary = "Lister toutes les sessions", description = "Cette méthode permet de récupérer la liste complète des sessions de formation disponibles.")

    @GetMapping("/all")
    List<SessionsDto> findAll();

    @Operation(summary = "Rechercher les sessions par formation", description = "Cette méthode permet de récupérer toutes les sessions associées à une formation spécifique.")
    @GetMapping("/formation/{formationId}")
    List<SessionsDto> findByFormation(@PathVariable Long formationId);

    @Operation(summary = "Rechercher les sessions par période", description = "Cette méthode permet de récupérer toutes les sessions planifiées entre deux dates données.")

    @GetMapping("/date-range")
    List<SessionsDto> findByDateBetween(

            @RequestParam LocalDate startDate,

            @RequestParam LocalDate endDate);

    @Operation(summary = "Lister les sessions à venir", description = "Cette méthode permet de récupérer la liste des sessions prévues dans le futur.")

    @GetMapping("/upcoming")
    List<SessionsDto> findUpcomingSessions();

  @Operation(summary = "Obtenir le nombre de places disponibles", description =
  "Cette méthode permet de connaître le nombre de places encore disponibles pour une session donnée.")
 
  @GetMapping("/{sessionId}/available-places")
 Integer getAvailablePlaces(@PathVariable Long sessionId);

    @Operation(summary = "Supprimer une session", description = "Cette méthode permet de supprimer une session de formation en fonction de son identifiant.")

    @DeleteMapping("/{id}")
    void delete(@PathVariable Long id);
}
