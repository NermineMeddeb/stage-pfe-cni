package CNI.Crud.Services;

import CNI.Crud.Dto.PaiementsDto;
import CNI.Crud.Model.Paiements;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface PaiementsService {

    PaiementsDto savePaiement(PaiementsDto dto);

    List<PaiementsDto> findAllPaiements();

    PaiementsDto findPaiementById(Long id);

    PaiementsDto updatePaiement(PaiementsDto dto);

    void deletePaiement(Long id);

    // Ces méthodes retournent des entités pour des raisons de performance
    List<Paiements> findPaiementsByUtilisateur(Long utilisateurId);

    List<Paiements> findPaiementsByFormation(Long formationId);

    List<Paiements> findPaiementsByStatut(String statut);

    List<Paiements> findPaiementsByModePaiement(String modePaiement);

    List<Paiements> findPaiementsByPeriode(LocalDate debut, LocalDate fin);

    Double getTotalMontantPaiements();

    List<Paiements> findRecentPaiements(int limit);

    Map<String, Long> getStatistiquesPaiementsParMode();

    Map<String, Double> getMontantPaiementsParMois();

    boolean confirmerPaiement(Long id);

    boolean annulerPaiement(Long id);

    // Méthodes pour les statistiques financières
    Double RevenuMoyenParFormations(Long id);

    Double ChiffreAffaireTotal();

    Double coutTotalDesFormateursExterne();

    Double coutTotalDesFormateursInterne();

    Double coutTotalDesEmployee();

    Double CoutsMoyenDuFormateur();

    Double CoutsEstimer(Long formationId);

    Double ChiffreAffaireEtudiantParPeriode(LocalDate debut, LocalDate fin);

    Double CoutsFormateursParPeriode(LocalDate debut, LocalDate fin);

    Double revenuMoyenParSession();

    Double revenuMoyenParEtudiant();

    Double calculerProfitTotal(LocalDate debut, LocalDate fin);

    Double CoutsEmployesParPeriode(LocalDate debut, LocalDate fin);

}