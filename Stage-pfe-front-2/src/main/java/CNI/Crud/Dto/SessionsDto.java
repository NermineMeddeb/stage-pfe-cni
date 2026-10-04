
package CNI.Crud.Dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

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

    @NotNull(message = "Le Utilisateurs ne doit pas être nul")
    private Integer utilisateurId;

    @NotNull(message = "La salle ne doit pas être nulle")
    private Integer salleId;

    @NotNull(message = "La date de début ne doit pas être nulle")
    private LocalDate dateDebut;

    @NotNull(message = "La date de fin ne doit pas être nulle")
    private LocalDate dateFin;

    @Positive(message = "La capacité doit être un nombre positif")
    private Integer capacite;

    @Positive(message = "Le nombre de places disponibles doit être un nombre positif")
    private Integer placesDisponibles;

    public static SessionsDto fromEntity(Sessions session) {
        if (session == null) {
            return null;
        }

        return SessionsDto.builder()
                .sessionId(session.getId())
                .formationId(session.getFormation() != null ? session.getFormation().getId()
                        : null)
                .utilisateurId(session.getUtilisateurs() != null ? session.getUtilisateurs().getId() : null) // Correction
                                                                                                             // ici
                .salleId(session.getSalle() != null ? session.getSalle().getId() : null)
                .dateDebut(session.getDateDebut())
                .dateFin(session.getDateFin())
                .capacite(session.getCapacite())
                .placesDisponibles(session.getPlacesDisponibles())
                .build();

    }

    public static Sessions toEntity(SessionsDto dto, Formations formation,
            Utilisateurs Utilisateurs, Salles salle) {
        if (dto == null) {
            return null;
        }

        Sessions session = new Sessions();
        session.setId(dto.getSessionId());
        session.setFormation(formation);
        session.setUtilisateurs(Utilisateurs); // Correction ici
        session.setSalle(salle);
        session.setDateDebut(dto.getDateDebut());
        session.setDateFin(dto.getDateFin());
        session.setCapacite(dto.getCapacite());
        session.setPlacesDisponibles(dto.getPlacesDisponibles());
        return session;
    }
}
