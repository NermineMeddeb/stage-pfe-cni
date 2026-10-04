
package CNI.Crud.Controller.Api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import CNI.Crud.Dto.SessionsDto;
import CNI.Crud.Model.Sessions;
import CNI.Crud.Model.Utilisateurs;
import io.swagger.v3.oas.annotations.Operation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RequestMapping("/api/sessions")
public interface SessionsApi {

  @Operation(summary = "Enregistrer une nouvelle formation", description = "Cette méthode permet d'enregistrer une nouvelle formation dans le système.")

  @PostMapping("/save")
  SessionsDto save(@RequestBody SessionsDto dto);

  @Operation(summary = "Update une formation", description = "Cette méthode permet d'updater une formation dans le système.")

  @PostMapping("/update")
  SessionsDto updatesessions(@RequestBody SessionsDto dto);

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

      @RequestParam LocalDateTime startDate,

      @RequestParam LocalDateTime endDate);

  @Operation(summary = "Lister les sessions à venir", description = "Cette méthode permet de récupérer la liste des sessions prévues dans le futur.")

  @GetMapping("/upcoming")
  List<SessionsDto> findUpcomingSessions();

  @Operation(summary = "Obtenir le nombre de places disponibles", description = "Cette méthode permet de connaître le nombre de places encore disponibles pour une session donnée.")

  @GetMapping("/{sessionId}/available-places")
  Integer getAvailablePlaces(@PathVariable Long sessionId);

  @Operation(summary = "Supprimer une session", description = "Cette méthode permet de supprimer une session de formation en fonction de son identifiant.")

  @DeleteMapping("/{id}")
  void delete(@PathVariable Long id);

  @Operation(summary = "Lister les participants d'une session", description = "Permet d'obtenir la liste des participants inscrits à une session spécifique.")
  @GetMapping("/{sessionId}/participants")
  List<Utilisateurs> getParticipants(@PathVariable Long sessionId);

  @Operation(summary = "Lister les participants d'une session", description = "Permet d'obtenir la liste des participants inscrits à une session spécifique.")
  @GetMapping("/{sessionId}/getStudentParticipants")
  List<Utilisateurs> getStudentParticipants(@PathVariable Long sessionId);

  @Operation(summary = "Lister les participants d'une session", description = "Permet d'obtenir la liste des participants inscrits à une session spécifique.")
  @GetMapping("/{sessionId}/getFormateur")
  List<Utilisateurs> getFormateur(@PathVariable Long sessionId);

  @Operation(summary = "Lister les sessions d'un formateur", description = "Permet de récupérer les sessions animées par un formateur spécifique.")
  @GetMapping("/findByFormateurid/{formateurId}")
  List<SessionsDto> findByFormateur(@PathVariable Long formateurId);

  @Operation(summary = "Lister les sessions d'un formateur", description = "Permet de récupérer les sessions animées par un formateur spécifique.")
  @GetMapping("/findAvailableSessionsByFormationId/{formationId}")
  List<SessionsDto> findAvailableSessionsByFormationId(@PathVariable Long formationId);

  @GetMapping("/addUserToSession/{sessionId}/{utilisateurId}")
  @Operation(summary = "Ajouter un utilisateur à une session", description = "Cette méthode permet d'ajouter un utilisateur à une session de formation spécifique.")
  public SessionsDto addUserToSession(@PathVariable Long sessionId, @PathVariable Long utilisateurId);

}
