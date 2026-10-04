package CNI.Crud.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import CNI.Crud.Model.Certificats;
import CNI.Crud.Model.Inscription;
import jakarta.transaction.Transactional;

public interface CertificatsRepository extends JpaRepository<Certificats, Long> {

    Optional<Certificats> findByInscriptionId(Integer inscriptionId);

    @Transactional

    @Modifying
    @Query("DELETE FROM Certificats c WHERE c.inscription.id = :inscriptionId")
    void deleteByInscriptionId(@Param("inscriptionId") Long inscriptionId);

    Optional<Certificats> findByNumeroSerie(String numeroSerie); // Recherche par numéro de série

    void deleteAllByInscriptionId(Integer inscriptionId);

    @Query("SELECT c FROM Certificats c WHERE c.inscription.id IN :inscriptionIds")
    List<Certificats> findByInscriptionIds(@Param("inscriptionIds") List<Long> inscriptionIds);

    void deleteByInscription(Inscription inscription);

}
