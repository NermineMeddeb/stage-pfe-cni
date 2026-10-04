package CNI.Crud.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import CNI.Crud.Model.Salles;
import CNI.Crud.Model.Themes;


@Repository
public interface ThemesRepository extends JpaRepository<Themes, Long> {

    List<Themes> findByNomContainingIgnoreCase(String nom);
  Optional<Themes> findById(Integer id);

    boolean existsByNom(String nom);

    @Query("SELECT t FROM Themes t JOIN t.formations f WHERE f.id = :formationId")
    List<Themes> findThemesByFormation(@Param("formationId") Long formationId);
}
