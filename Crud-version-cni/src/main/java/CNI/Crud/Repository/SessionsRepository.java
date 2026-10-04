package CNI.Crud.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import CNI.Crud.Model.Sessions;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SessionsRepository extends JpaRepository<Sessions, Long> {

    // Trouver les sessions associées à une formation

    List<Sessions> findByFormationId(Long formationId);

    @Query("SELECT s FROM Sessions s " +
            "WHERE s.formation.id = :formationId " +
            "AND s.placesDisponibles > 0 " +
            "AND s.dateDebut IS NOT NULL " +
            "AND s.dateDebut >= CURRENT_TIMESTAMP")
    List<Sessions> findAvailableSessionsByFormationId(@Param("formationId") Long formationId);

    // Trouver les sessions entre deux dates
    List<Sessions> findByDateDebutBetween(LocalDateTime startDate, LocalDateTime endDate);

    // Trouver les sessions à venir
    @Query("SELECT s FROM Sessions s WHERE s.dateDebut > CURRENT_DATE")
    List<Sessions> findUpcomingSessions();

    // Trouver le nombre de places disponibles pour une session

    @Query("SELECT s.placesDisponibles FROM Sessions s WHERE s.id = :sessionId")
    Integer getAvailablePlaces(Long sessionId);

    List<Sessions> findByDateDebutBetweenOrDateFinBetween(
            LocalDateTime startDate1, LocalDateTime endDate1,
            LocalDateTime startDate2, LocalDateTime endDate2);

    void deleteBySalleId(Long salleId);

    List<Sessions> findBySalleId(Long salleId);

}
