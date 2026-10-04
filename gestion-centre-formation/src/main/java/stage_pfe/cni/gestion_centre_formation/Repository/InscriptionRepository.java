package stage_pfe.cni.gestion_centre_formation.Repository;
/* 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import stage_pfe.cni.gestion_centre_formation.Dto.FormationsDto;
import stage_pfe.cni.gestion_centre_formation.Model.Inscription;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InscriptionRepository extends JpaRepository<Inscription, Long> {

      public List<FormationsDto> findBystatut(String statut);

 /*      @Query("SELECT CASE WHEN COUNT(i) < f.placesMax THEN true ELSE false END " +
                  "FROM Formations f " +
                  "JOIN Sessions s ON s.formation = f " +
                  "LEFT JOIN s.inscriptions i " +
                  "WHERE f.id = :formationId " +
                  "AND s.dateDebut <= :endDate AND s.dateFin >= :startDate " +
                  "AND s.statut = 'ACTIVE' " +
                  "GROUP BY f.placesMax")
      boolean checkFormationAvailability( 

                  @Param("formationId") Long formationId,

                  @Param("startDate") LocalDate startDate,

                  @Param("endDate") LocalDate endDate); */

      /*
       * @Query("SELECT CASE WHEN COUNT(i) > 0 THEN true ELSE false END " +
       * "FROM Inscription i " +
       * "WHERE i.formation.id = :formationId " +
       * "AND i.statut = 'ACTIVE' " +
       * "AND i.dateFin >= CURRENT_DATE")
       * boolean hasActiveInscriptions(@Param("formationId") Long formationId);
       * 
       * List<Inscription> findByFormationId(Long formationId);
       * 
       * @Query("SELECT i FROM Inscription i " +
       * "WHERE i.formation.id = :formationId " +
       * "AND i.statut = 'ACTIVE' " +
       * "AND i.dateFin >= CURRENT_DATE")
       * List<Inscription> findActiveInscriptionsByFormationId(@Param("formationId")
       * Long formationId);
       * 
       * @Query("SELECT COUNT(i) FROM Inscription i WHERE i.formation.id = :formationId"
       * )
       * Long countInscriptionsByFormationId(@Param("formationId") Long formationId);
       * 
       * List<Inscription> findByParticipantId(Long participantId);
       * 
       * @Query("SELECT i FROM Inscription i " +
       * "WHERE i.participant.id = :participantId " +
       * "AND i.statut = 'ACTIVE' " +
       * "AND i.dateFin >= CURRENT_DATE")
       * List<Inscription>
       * findActiveInscriptionsByParticipantId(@Param("participantId") Long
       * participantId);
       * 
       * @Query("SELECT CASE WHEN COUNT(i) > 0 THEN true ELSE false END " +
       * "FROM Inscription i " +
       * "WHERE i.formation.id = :formationId " +
       * "AND i.participant.id = :participantId " +
       * "AND i.statut = 'ACTIVE' " +
       * "AND i.dateFin >= CURRENT_DATE")
       * boolean isParticipantEnrolled(
       * 
       * @Param("formationId") Long formationId,
       * 
       * @Param("participantId") Long participantId);
       * 
       * @Query("SELECT i FROM Inscription i " +
       * "WHERE (:startDate IS NULL OR i.dateDebut >= :startDate) " +
       * "AND (:endDate IS NULL OR i.dateFin <= :endDate)")
       * List<Inscription> findByPeriod(
       * 
       * @Param("startDate") LocalDate startDate,
       * 
       * @Param("endDate") LocalDate endDate);
       * 
       * @Modifying
       * 
       * @Query("UPDATE Inscription i SET i.statut = 'ANNULEE' " +
       * "WHERE i.formation.id = :formationId " +
       * "AND i.dateFin >= CURRENT_DATE")
       * void cancelInscriptionsForFormation(@Param("formationId") Long formationId);
       */
/* } */ 