package CNI.Crud.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import CNI.Crud.Model.Inscription;
import CNI.Crud.Model.Sessions;

@Repository
public interface InscriptionRepository extends JpaRepository<Inscription, Long> {
    List<Inscription> findByStatut(String statut);

    Optional<Inscription> findById(Integer id);

    List<Inscription> findByCertificatGenere(Boolean certificatGenere);

    // Mise à jour de certificatGenere à true pour une inscription donnée par ID
    @Modifying
    @Query("UPDATE Inscription i SET i.certificatGenere = true WHERE i.id = :id")
    void transformCertificatToGenerate(Long id);

    @Modifying
    @Query("UPDATE Inscription i SET i.certificatGenere = false WHERE i.id = :id")
    void transformCertificatToNonGenerate(Long id);

    void deleteAllBySessionId(Integer sessionId);

    List<Inscription> findBySessionId(Integer sessionId);

    List<Inscription> findByUtilisateurId(Long utilisateurId);

    void deleteByUtilisateur_Id(long utilisateurId);

    List<Inscription> findBySession(Sessions session);

}