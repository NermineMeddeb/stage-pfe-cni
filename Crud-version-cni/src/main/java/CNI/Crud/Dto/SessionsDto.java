package CNI.Crud.Dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import CNI.Crud.Model.Formations;
import CNI.Crud.Model.Salles;
import CNI.Crud.Model.Sessions;
import CNI.Crud.Model.Utilisateurs;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionsDto {

    private Integer sessionId;

    @NotNull(message = "La formation ne doit pas être nulle")
    private Integer formationId;

    @NotNull(message = "Les utilisateurs ne doivent pas être nuls")
    private List<Integer> utilisateursIds;
    @NotNull(message = "La salle ne doit pas être nulle")
    private Integer salleId;

    @NotNull(message = "La date de début ne doit pas être nulle")
    private LocalDateTime dateDebut;

    @NotNull(message = "La date de fin ne doit pas être nulle")
    private LocalDateTime dateFin;

    @Positive(message = "La capacité doit être un nombre positif")
    private Integer capacite;

    @Positive(message = "Le nombre de places disponibles doit être un nombre positif")
    private Integer placesDisponibles;

    // Méthode de transformation de l'entité en DTO
    public static SessionsDto fromEntity(Sessions session) {
        if (session == null) {
            return null;
        }
        return SessionsDto.builder()
                .sessionId(session.getId())
                .formationId(session.getFormation() != null ? session.getFormation().getId() : null)
                .utilisateursIds(session.getUtilisateurs() != null ? session.getUtilisateurs().stream()
                        .map(Utilisateurs::getId)
                        .collect(Collectors.toList())
                        : null)
                .salleId(session.getSalle() != null ? session.getSalle().getId() : null)
                .dateDebut(session.getDateDebut())
                .dateFin(session.getDateFin())
                .capacite(session.getCapacite())
                .placesDisponibles(session.getPlacesDisponibles())
                .build();
    }

    // Méthode de transformation du DTO en entité
    public static Sessions toEntity(SessionsDto dto, Formations formation, List<Utilisateurs> utilisateurs,
            Salles salle) {
        if (dto == null) {
            return null;
        }
        Sessions session = new Sessions();
        session.setId(dto.getSessionId());
        session.setFormation(formation);
        session.setUtilisateurs(utilisateurs);
        session.setSalle(salle);
        session.setDateDebut(dto.getDateDebut());
        session.setDateFin(dto.getDateFin());
        session.setCapacite(dto.getCapacite());
        session.setPlacesDisponibles(dto.getPlacesDisponibles());
        return session;
    }
}
