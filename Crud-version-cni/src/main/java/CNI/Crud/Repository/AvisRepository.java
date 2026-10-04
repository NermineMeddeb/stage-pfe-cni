package CNI.Crud.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import CNI.Crud.Model.Avis;
import CNI.Crud.Model.Sessions;

public interface AvisRepository extends JpaRepository<Avis, Long> {

    void deleteBySessions_Id(Long sessionId);

    void deleteByUtilisateurs_Id(Long utilisateurId);

    @Modifying
    @Query(value = "DELETE FROM avis_formateurs WHERE formateur_id = :formateurId", nativeQuery = true)
    void deleteFormateurFromAvisFormateurs(@Param("formateurId") Long formateurId);

    void deleteAllBySessions(Sessions sessions);

}
