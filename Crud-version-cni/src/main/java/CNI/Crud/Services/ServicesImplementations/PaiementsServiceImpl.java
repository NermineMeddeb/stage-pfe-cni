package CNI.Crud.Services.ServicesImplementations;

import CNI.Crud.Dto.PaiementsDto;
import CNI.Crud.Exceptions.ErrorCodes;
import CNI.Crud.Exceptions.InvalidEntityException;
import CNI.Crud.Model.Formations;
import CNI.Crud.Model.Paiements;
import CNI.Crud.Model.Sessions;
import CNI.Crud.Model.Utilisateurs;
import CNI.Crud.Repository.FormationsRepository;
import CNI.Crud.Repository.PaiementsRepository;
import CNI.Crud.Repository.SessionsRepository;
import CNI.Crud.Repository.UtilisateursRepository;
import CNI.Crud.Services.PaiementsService;
import CNI.Crud.Validateur.PaiementsValidateur;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PaiementsServiceImpl implements PaiementsService {

    private final PaiementsRepository paiementsRepository;
    private final UtilisateursRepository utilisateurRepository;
    private final SessionsRepository sessionsRepository;

    @Autowired
    public PaiementsServiceImpl(PaiementsRepository paiementsRepository, UtilisateursRepository utilisateurRepository,
            SessionsRepository sessionsRepository) {
        this.paiementsRepository = paiementsRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.sessionsRepository = sessionsRepository;
    }

    @Override
    public PaiementsDto savePaiement(PaiementsDto dto) {
        // Validation des données d'entrée
        List<String> errors = PaiementsValidateur.validate(dto);
        if (!errors.isEmpty()) {
            log.error("Paiement non valide: {}", dto);
            throw new InvalidEntityException(
                    "Paiement non valide",
                    ErrorCodes.PAIEMENT_NOT_VALID,
                    errors);
        }

        try {
            // Recherche des entités Utilisateur et Formation basées sur les IDs
            Utilisateurs utilisateur = utilisateurRepository.findById(dto.getUtilisateurId())
                    .orElseThrow(() -> new InvalidEntityException(
                            "Utilisateur non trouvé avec l'ID : " + dto.getUtilisateurId(),
                            ErrorCodes.PAIEMENT_NOT_FOUND));

            Sessions session = sessionsRepository.findById(dto.getSessionsId().longValue())
                    .orElseThrow(() -> new InvalidEntityException(
                            "Session non trouvée avec l'ID : " + dto.getSessionsId(),
                            ErrorCodes.PAIEMENT_NOT_FOUND));

            // Conversion du DTO en entité et sauvegarde
            Paiements paiement = paiementsRepository.save(PaiementsDto.toEntity(dto, utilisateur, session));

            // Retourner l'entité sauvegardée sous forme de DTO
            return PaiementsDto.fromEntity(paiement);
        } catch (Exception e) {
            log.error("Erreur lors de l'enregistrement du paiement: {}", e.getMessage());
            throw new InvalidEntityException(
                    "Erreur lors de l'enregistrement du paiement",
                    e,
                    ErrorCodes.PAIEMENT_SAVE_ERROR);
        }
    }

    @Override
    public List<PaiementsDto> findAllPaiements() {
        try {
            return paiementsRepository.findAll().stream()
                    .map(PaiementsDto::fromEntity)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des paiements: {}", e.getMessage());
            throw new InvalidEntityException(
                    "Erreur lors de la récupération des paiements",
                    e,
                    ErrorCodes.PAIEMENT_NOT_FOUND);
        }
    }

    @Override
    public PaiementsDto findPaiementById(Long id) {
        if (id == null) {
            log.error("Paiement ID est nul");
            throw new InvalidEntityException(
                    "L'ID du paiement ne peut pas être nul",
                    ErrorCodes.PAIEMENT_NOT_FOUND);
        }

        return paiementsRepository.findById(id)
                .map(PaiementsDto::fromEntity)
                .orElseThrow(() -> new InvalidEntityException(
                        "Aucun paiement trouvé avec l'ID = " + id,
                        ErrorCodes.PAIEMENT_NOT_FOUND));
    }

    @Override
    public PaiementsDto updatePaiement(PaiementsDto dto) {
        if (dto == null || dto.getId() == null) {
            throw new InvalidEntityException("Les données du paiement sont invalides",
                    ErrorCodes.PAIEMENT_NOT_VALID, List.of("L'ID du paiement est requis"));
        }

        // Vérifier si le paiement existe
        Paiements existingPaiement = paiementsRepository.findById(dto.getId().longValue())
                .orElseThrow(() -> new InvalidEntityException("Paiement non trouvé avec ID : " + dto.getId(),
                        ErrorCodes.PAIEMENT_NOT_FOUND));

        // Mise à jour des champs du paiement
        if (dto.getMontant() != null) {
            existingPaiement.setMontant(dto.getMontant());
        }
        if (dto.getStatut() != null) {
            existingPaiement.setStatut(dto.getStatut());
        }
        if (dto.getModePaiement() != null) {
            existingPaiement.setModePaiement(dto.getModePaiement());
        }
        if (dto.getDatePaiement() != null) {
            existingPaiement.setDatePaiement(dto.getDatePaiement());
        }

        // Sauvegarde du paiement mis à jour
        Paiements updatedPaiement = paiementsRepository.save(existingPaiement);
        return PaiementsDto.fromEntity(updatedPaiement);
    }

    @Override
    public void deletePaiement(Long id) {
        if (!paiementsRepository.existsById(id)) {
            log.error("Paiement non trouvé avec l'ID : {}", id);
            throw new InvalidEntityException("Paiement non trouvé avec l'ID : " + id,
                    ErrorCodes.PAIEMENT_NOT_FOUND);
        }
        paiementsRepository.deleteById(id);
    }

    @Override
    public List<Paiements> findPaiementsByUtilisateur(Long utilisateurId) {
        return paiementsRepository.findByUtilisateurId(utilisateurId);
    }

    @Override
    public List<Paiements> findPaiementsByFormation(Long formationId) {
        return paiementsRepository.findBySessionsId(formationId);
    }

    @Override
    public List<Paiements> findPaiementsByStatut(String statut) {
        return paiementsRepository.findByStatut(statut);
    }

    @Override
    public List<Paiements> findPaiementsByModePaiement(String modePaiement) {
        return paiementsRepository.findByModePaiement(modePaiement);
    }

    @Override
    public List<Paiements> findPaiementsByPeriode(LocalDate debut, LocalDate fin) {
        return paiementsRepository.findByDatePaiementBetween(debut, fin);
    }

    @Override
    public Double getTotalMontantPaiements() {
        return paiementsRepository.findAll()
                .stream()
                .filter(p -> p.getStatut() != null )
                .mapToDouble(Paiements::getMontant)
                .sum();
    }

    @Override
    public List<Paiements> findRecentPaiements(int limit) {
        return paiementsRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Paiements::getDatePaiement).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Long> getStatistiquesPaiementsParMode() {
        return paiementsRepository.findAll()
                .stream()
                .filter(p -> p.getStatut() != null )
                .collect(Collectors.groupingBy(Paiements::getModePaiement, Collectors.counting()));
    }

    @Override
    public Map<String, Double> getMontantPaiementsParMois() {
        return paiementsRepository.findAll()
                .stream()
                .filter(p -> p.getStatut() != null )
                .collect(Collectors.groupingBy(
                        p -> p.getDatePaiement().getMonth().toString(),
                        Collectors.summingDouble(Paiements::getMontant)));
    }

    @Override
    public boolean confirmerPaiement(Long id) {
        return paiementsRepository.findById(id).map(p -> {
            paiementsRepository.save(p);
            return true;
        }).orElseThrow(() -> new InvalidEntityException("Paiement non trouvé avec l'ID : " + id));
    }

    @Override
    public boolean annulerPaiement(Long id) {
        return paiementsRepository.findById(id).map(p -> {
            p.setStatut("ANNULE");
            paiementsRepository.save(p);
            return true;
        }).orElseThrow(() -> new InvalidEntityException("Paiement non trouvé avec l'ID : " + id));
    }

    @Override
    public Double RevenuMoyenParFormations(Long id) {
        List<Paiements> paiements = paiementsRepository.findBySessionsId(id);
        if (paiements.isEmpty()) {
            log.warn("Aucun paiement trouvé pour la formation avec ID: {}", id);
            return 0.0;
        }

        List<Paiements> paiementsConfirmes = paiements.stream()
                .filter(p -> p.getStatut() != null )
                .collect(Collectors.toList());

        if (paiementsConfirmes.isEmpty()) {
            log.warn("Aucun paiement confirmé trouvé pour la formation avec ID: {}", id);
            return 0.0;
        }

        return paiementsConfirmes.stream()
                .mapToDouble(Paiements::getMontant)
                .average()
                .orElse(0.0);
    }

    @Override
    public Double ChiffreAffaireTotal() {
        List<Paiements> paiements = paiementsRepository.findAll();
    
        return paiements.stream()
                .filter(p -> p.getStatut() != null
                        && p.getUtilisateur() != null
                        && p.getUtilisateur().getRole() != null
                        && p.getUtilisateur().getRole().name().equalsIgnoreCase("ETUDIANT"))
                .mapToDouble(Paiements::getMontant)
                .sum();
    }

    @Override
    public Double coutTotalDesFormateursExterne() {
        List<Paiements> paiements = paiementsRepository.findAll();

        return paiements.stream()
                .filter(p -> p.getStatut() != null
                        && p.getUtilisateur() != null
                        && p.getUtilisateur().getRole() != null
                        && p.getUtilisateur().getRole().toString().equalsIgnoreCase("EXTERNE"))
                .mapToDouble(Paiements::getMontant)
                .sum();
    }

    @Override
    public Double coutTotalDesEmployee() {
        List<Paiements> paiements = paiementsRepository.findAll();

        return paiements.stream()
                .filter(p -> p.getStatut() != null
                        && p.getUtilisateur() != null
                        && p.getUtilisateur().getRole() != null
                        && p.getUtilisateur().getRole().toString().equalsIgnoreCase("EMPLOYEE"))
                .mapToDouble(Paiements::getMontant)
                .sum();
    }

    @Override
    public Double coutTotalDesFormateursInterne() {
        List<Paiements> paiements = paiementsRepository.findAll();

        return paiements.stream()
                .filter(p -> p.getStatut() != null
                        && p.getUtilisateur() != null
                        && p.getUtilisateur().getRole() != null
                        && p.getUtilisateur().getRole().toString().equalsIgnoreCase("INTERNE"))
                .mapToDouble(Paiements::getMontant)
                .sum();
    }

    @Override
    public Double CoutsMoyenDuFormateur() {
        List<Paiements> paiements = paiementsRepository.findAll();

        // Filtrer uniquement les paiements confirmés des étudiants
        Map<Long, List<Paiements>> paiementsParEtudiant = paiements.stream()
                .filter(p -> p.getStatut() != null
                        && p.getUtilisateur() != null
                        && p.getUtilisateur().getRole() != null
                        && p.getUtilisateur().getRole().toString().equalsIgnoreCase("INTERNE") ||
                        p.getUtilisateur().getRole().toString().equalsIgnoreCase("EXTERNE"))
                .collect(Collectors.groupingBy(p -> p.getUtilisateur().getId().longValue())); // Ensure key is of type
                                                                                              // Long

        if (paiementsParEtudiant.isEmpty()) {
            return 0.0; // Si aucun paiement confirmé n'existe, retourner 0.0
        }

        // Calcul du total des paiements et du nombre d'étudiants
        double total = paiementsParEtudiant.values().stream()
                .flatMap(List::stream)
                .mapToDouble(Paiements::getMontant)
                .sum();

        // Calcul du nombre d'étudiants (taille de la carte)
        long nombreEtudiants = paiementsParEtudiant.size();

        // Retourner le revenu moyen par étudiant
        return total / nombreEtudiants;
    }

    @Override
    public Double CoutsEstimer(Long formationId) {
        List<Paiements> paiements = paiementsRepository.findBySessionsId(formationId);
        if (paiements.isEmpty()) {
            log.warn("Aucun paiement trouvé pour la formation avec ID: {}", formationId);
            return 0.0;
        }

        return paiements.stream()
                .filter(p -> p.getUtilisateur() != null &&
                        p.getUtilisateur().getRole() != null &&
                        !p.getUtilisateur().getRole().toString().equalsIgnoreCase("ETUDIANT") &&
                        p.getStatut() != null )
                .mapToDouble(Paiements::getMontant)
                .sum();
    }

    @Override
    public Double ChiffreAffaireEtudiantParPeriode(LocalDate debut, LocalDate fin) {
        if (debut == null || fin == null) {
            log.error("Les dates de début et de fin ne peuvent pas être nulles");
            throw new InvalidEntityException("Les dates de début et de fin ne peuvent pas être nulles",
                    ErrorCodes.PAIEMENT_NOT_VALID);
        }

        List<Paiements> paiements = paiementsRepository.findByDatePaiementBetween(debut, fin);

        return paiements.stream()
                .filter(p -> p.getStatut() != null
                        && p.getUtilisateur() != null
                        && p.getUtilisateur().getRole() != null
                        && p.getUtilisateur().getRole().toString().equalsIgnoreCase("ETUDIANT"))
                .mapToDouble(Paiements::getMontant)
                .sum();
    }

    @Override
    public Double CoutsFormateursParPeriode(LocalDate debut, LocalDate fin) {
        if (debut == null || fin == null) {
            log.error("Les dates de début et de fin ne peuvent pas être nulles");
            throw new InvalidEntityException("Les dates de début et de fin ne peuvent pas être nulles",
                    ErrorCodes.PAIEMENT_NOT_VALID);
        }

        List<Paiements> paiements = paiementsRepository.findByDatePaiementBetween(debut, fin);

        return paiements.stream()
                .filter(p -> p.getStatut() != null
                        && p.getUtilisateur() != null
                        && p.getUtilisateur().getRole() != null
                        && (p.getUtilisateur().getRole().toString().equalsIgnoreCase("INTERNE") ||
                                p.getUtilisateur().getRole().toString().equalsIgnoreCase("EXTERNE")))
                .mapToDouble(Paiements::getMontant)

                .sum();
    }

    @Override
    public Double CoutsEmployesParPeriode(LocalDate debut, LocalDate fin) {
        if (debut == null || fin == null) {
            log.error("Les dates de début et de fin ne peuvent pas être nulles");
            throw new InvalidEntityException("Les dates de début et de fin ne peuvent pas être nulles",
                    ErrorCodes.PAIEMENT_NOT_VALID);
        }

        List<Paiements> paiements = paiementsRepository.findByDatePaiementBetween(debut, fin);

        return paiements.stream()
                .filter(p -> p.getStatut() != null
                        && p.getUtilisateur() != null
                        && p.getUtilisateur().getRole() != null
                        && (p.getUtilisateur().getRole().toString().equalsIgnoreCase("EMPLOYEE")))
                .mapToDouble(Paiements::getMontant)

                .sum();
    }

    @Override
    public Double revenuMoyenParSession() {
        List<Paiements> paiements = paiementsRepository.findAll();

        // Filtrer uniquement les paiements confirmés des étudiants avec session
        Map<Long, List<Paiements>> paiementsParSession = paiements.stream()
                .filter(p -> p.getStatut() != null
                        && p.getUtilisateur() != null
                        && p.getUtilisateur().getRole() != null
                        && p.getUtilisateur().getRole().toString().equalsIgnoreCase("ETUDIANT")
                        && p.getSessions() != null)
                .collect(Collectors.groupingBy(p -> p.getSessions().getId().longValue())); // Ensure key is of type Long

        if (paiementsParSession.isEmpty()) {
            return 0.0; // Si aucune session avec paiement confirmé n'existe, retourner 0.0
        }

        // Calcul du total des paiements et de la moyenne par session
        double total = paiementsParSession.values().stream()
                .flatMap(List::stream)
                .mapToDouble(Paiements::getMontant)
                .sum();

        // Retourner le revenu moyen par session
        return total / paiementsParSession.size();
    }

    @Override
    public Double revenuMoyenParEtudiant() {
        List<Paiements> paiements = paiementsRepository.findAll();

        // Filtrer uniquement les paiements confirmés des étudiants
        Map<Long, List<Paiements>> paiementsParEtudiant = paiements.stream()
                .filter(p -> p.getStatut() != null
                        && p.getUtilisateur() != null
                        && p.getUtilisateur().getRole() != null
                        && p.getUtilisateur().getRole().toString().equalsIgnoreCase("ETUDIANT"))
                .collect(Collectors.groupingBy(p -> p.getUtilisateur().getId().longValue())); // Ensure key is of type
                                                                                              // Long

        if (paiementsParEtudiant.isEmpty()) {
            return 0.0; // Si aucun paiement confirmé n'existe, retourner 0.0
        }

        // Calcul du total des paiements et du nombre d'étudiants
        double total = paiementsParEtudiant.values().stream()
                .flatMap(List::stream)
                .mapToDouble(Paiements::getMontant)
                .sum();

        // Calcul du nombre d'étudiants (taille de la carte)
        long nombreEtudiants = paiementsParEtudiant.size();

        // Retourner le revenu moyen par étudiant
        return total / nombreEtudiants;
    }

    @Override
    public Double calculerProfitTotal(LocalDate debut, LocalDate fin) {
        // Calculer le chiffre d'affaires total
        Double chiffreAffaireTotal = ChiffreAffaireEtudiantParPeriode(debut, fin);

        // Calculer le coût des formateurs internes et externes
        Double coutFormateursTotal = CoutsFormateursParPeriode(debut, fin);

        // Calculer le coût des employés (si nécessaire)
        Double coutEmployesTotal = CoutsEmployesParPeriode(debut, fin);

        // Calculer le profit total
        Double profitTotal = chiffreAffaireTotal - coutFormateursTotal - coutEmployesTotal;

        return profitTotal;
    }

}
