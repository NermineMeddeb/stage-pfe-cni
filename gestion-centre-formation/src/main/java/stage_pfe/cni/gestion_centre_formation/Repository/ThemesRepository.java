package stage_pfe.cni.gestion_centre_formation.Repository;
/* 
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import stage_pfe.cni.gestion_centre_formation.Model.Themes;

@Repository
public interface ThemesRepository extends JpaRepository<Themes, Long> {

    List<Themes> findByNomContainingIgnoreCase(String nom);


    boolean existsByNom(String nom);

    @Query("SELECT t FROM Themes t JOIN t.formations f WHERE f.id = :formationId")
    List<Themes> findThemesByFormation(@Param("formationId") Long formationId);
}
 */