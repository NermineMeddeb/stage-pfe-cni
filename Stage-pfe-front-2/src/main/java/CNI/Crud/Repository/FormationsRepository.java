package CNI.Crud.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import CNI.Crud.Model.Formations;

import java.util.List;
import java.util.Optional;

@Repository
public interface FormationsRepository extends JpaRepository<Formations, Long> {

  Optional<Formations> findById(Integer id);

  List<Formations> findByThemeId(Long themeId);

  List<Formations> findByNiveau(String niveau);

  public List<Formations> findByStatut(String statut);

  List<Formations> findByPrixBetween(Double minPrix, Double maxPrix);

  List<Formations> findAllByOrderByDureeAsc();

  List<Formations> findAllByOrderByDureeDesc();

  List<Formations> findAllByOrderByPrixDesc();

  List<Formations> findAllByOrderByPrixAsc();
  List<Formations> findByNiveauAndPrixLessThanEqual(String niveau, Double maxPrix);

  // List<Formations> findByFormateurId(Long utilisateurIdLong);

  // boolean existsByTitreIgnoreCase(String titre);

  // List<Formations> findUpcomingFormations(@Param("date") LocalDate date);

  // List<Formations> findCurrentFormations(@Param("date") LocalDate date);

  // List<Formations> findByDateRange( @Param("dateDebut") LocalDate dateDebut,
  // @Param("dateFin") LocalDate dateFin);

  // Recherche par mot-clé dans le titre et la description
  @Query("SELECT f FROM Formations f WHERE f.titre LIKE %:keyword% OR f.description LIKE %:keyword%")
  List<Formations> searchFormations(@Param("keyword") String keyword);

  long count();

  // List<Formations> findMostPopularFormations();

  // List<Formations> findAvailableFormations();

  // void deleteOldCancelledFormations(@Param("date") LocalDate date);

  // void updateFormationStatus(@Param("id") Long id, @Param("statut") String
  // statut);
}