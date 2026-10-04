package CNI.Crud.Repository;

import CNI.Crud.Model.Paiements;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaiementsRepository extends JpaRepository<Paiements, Long> {
    List<Paiements> findByUtilisateurId(Long utilisateurId);

    List<Paiements> findBySessionsId(Long SessionsId);

    List<Paiements> findByStatut(String statut);

    List<Paiements> findByModePaiement(String modePaiement);

    List<Paiements> findByDatePaiementBetween(LocalDate debut, LocalDate fin);

    void deleteAllBySessionsId(Integer sessionsId);


}
