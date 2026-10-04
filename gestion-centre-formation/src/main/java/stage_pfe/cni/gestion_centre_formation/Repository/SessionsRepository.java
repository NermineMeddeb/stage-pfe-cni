package stage_pfe.cni.gestion_centre_formation.Repository;
/* 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import stage_pfe.cni.gestion_centre_formation.Model.Sessions;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SessionsRepository extends JpaRepository<Sessions, Long> {

    // Trouver les sessions associées à une formation
    List<Sessions> findByFormationId(Long formationId);

    // Trouver les sessions associées à un formateur (utilisateur)
   // List<Sessions> findByUtilisateursId(Long formateurId);

    // Trouver les sessions entre deux dates
    List<Sessions> findByDateDebutBetween(LocalDate startDate, LocalDate endDate);

    // Trouver les sessions à venir
    @Query("SELECT s FROM Sessions s WHERE s.dateDebut > CURRENT_DATE")
    List<Sessions> findUpcomingSessions();

    // Trouver le nombre de places disponibles pour une session
    @Query("SELECT s.placesDisponibles FROM Sessions s WHERE s.id = :sessionId")
    Integer getAvailablePlaces(Long sessionId);
}
 */