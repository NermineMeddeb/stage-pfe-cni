/* package CNI.Crud.Services.ServicesImplementations;

import CNI.Crud.Model.FinancialData;
import CNI.Crud.Model.Paiements;
import CNI.Crud.Model.Sessions;
import CNI.Crud.Repository.PaiementsRepository;
import CNI.Crud.Repository.SessionsRepository;
import CNI.Crud.Repository.UtilisateursRepository;
import CNI.Crud.Repository.financialDataRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class FinancialDataService {

    private final PaiementsRepository paiementsRepository;
    private final SessionsRepository sessionsRepository;
    private final UtilisateursRepository utilisateursRepository;
    private final financialDataRepository financialDataRepository;

    @Autowired
    public FinancialDataService(
            PaiementsRepository paiementsRepository,
            SessionsRepository sessionsRepository,
            UtilisateursRepository utilisateursRepository,
            financialDataRepository financialDataRepository) {
        this.paiementsRepository = paiementsRepository;
        this.sessionsRepository = sessionsRepository;
        this.utilisateursRepository = utilisateursRepository;
        this.financialDataRepository = financialDataRepository;
    }

    long nombreHeuresFormation = 0;

    public FinancialData generateFinancialDataForPeriod(LocalDate debut, LocalDate fin) {
        // Récupérer tous les paiements pour la période
        List<Paiements> paiements = paiementsRepository.findByDatePaiementBetween(debut, fin);

        if (paiements.isEmpty()) {
            log.info("Aucun paiement trouvé pour la période du {} au {}", debut, fin);
            return null;
        }

        // Créer une nouvelle instance de FinancialData
        FinancialData financialData = new FinancialData();
        financialData.setDate(fin); // Utiliser la date de fin comme date de référence

        // Calculer le chiffre d'affaires (paiements des étudiants)
        Double chiffreAffaire = paiements.stream()
                .filter(p -> p.getStatut() != null
                        && p.getUtilisateur() != null
                        && p.getUtilisateur().getRole() != null
                        && p.getUtilisateur().getRole().toString().equalsIgnoreCase("ETUDIANT"))
                .mapToDouble(Paiements::getMontant)
                .sum();
        financialData.setChiffreAffaire(chiffreAffaire);

        // Calculer le coût des formateurs (internes et externes)
        Double coutFormateur = paiements.stream()
                .peek(p -> System.out.println("Paiement brut - ID: " + p.getId() +
                        ", Montant: " + p.getMontant() +
                        ", Statut: " + p.getStatut() +
                        ", Utilisateur: " + (p.getUtilisateur() != null ? p.getUtilisateur().getId() : "null")))
                .filter(p -> {
                    boolean statutOk = p.getStatut() != null;
                    boolean utilisateurOk = p.getUtilisateur() != null;
                    boolean roleOk = utilisateurOk && p.getUtilisateur().getRole() != null;
                    boolean roleFormateur = roleOk &&
                            (p.getUtilisateur().getRole().toString().equalsIgnoreCase("INTERNE") ||
                                    p.getUtilisateur().getRole().toString().equalsIgnoreCase("EXTERNE"));

                    System.out.println("Filtre pour paiement ID " + p.getId() + ": " +
                            "statutOk=" + statutOk +
                            ", utilisateurOk=" + utilisateurOk +
                            ", roleOk=" + roleOk +
                            ", roleFormateur=" + roleFormateur);

                    return statutOk && utilisateurOk && roleOk && roleFormateur;
                })
                .peek(p -> System.out.println("Paiement filtré - ID: " + p.getId() +
                        ", Role: " + p.getUtilisateur().getRole() +
                        ", Montant: " + p.getMontant()))
                .mapToDouble(Paiements::getMontant)
                .peek(sum -> System.out.println("Montant ajouté à la somme: " + sum))
                .sum();

        System.out.println("Coût total des formateurs calculé: " + coutFormateur);
        financialData.setCoutFormateur(coutFormateur);
        // Calculer le coût des employés
        Double coutEmploye = paiements.stream()
                .filter(p -> p.getStatut() != null
                        && p.getUtilisateur() != null
                        && p.getUtilisateur().getRole() != null
                        && p.getUtilisateur().getRole().toString().equalsIgnoreCase("EMPLOYEE"))

                .mapToDouble(Paiements::getMontant)
                .sum();

        financialData.setCoutEmploye(coutEmploye);

        // Calculer le nombre de clients (étudiants distincts ayant payé)
        Integer nombreClients = (int) paiements.stream()
                .filter(p -> p.getUtilisateur() != null
                        && p.getUtilisateur().getRole() != null
                        && p.getUtilisateur().getRole().toString().equalsIgnoreCase("ETUDIANT"))
                .map(p -> p.getUtilisateur().getId())
                .distinct()
                .count();
        financialData.setNombreClients(nombreClients);

        // Calculer le nombre de formations (sessions distinctes)
        Integer nombreFormations = (int) paiements.stream()
                .filter(p -> p.getSessions() != null)
                .map(p -> p.getSessions().getId())
                .distinct()
                .count();
        financialData.setNombreFormations(nombreFormations);

        // Calculer le nombre d'employés (formateurs + administratifs)
        Integer nombreEmployes = (int) paiements.stream()
                .filter(p -> p.getUtilisateur() != null
                        && p.getUtilisateur().getRole() != null
                        && (p.getUtilisateur().getRole().toString().equalsIgnoreCase("EMPLOYEE") ||
                                p.getUtilisateur().getRole().toString().equalsIgnoreCase("ADMIN")))
                .map(p -> p.getUtilisateur().getId())
                .distinct()
                .count();
        financialData.setNombreEmployes(nombreEmployes);

        // Calculer le nombre d'heures de formation
        int nombreHeuresFormation = 0;
        List<Long> sessionIds = paiements.stream()
                .filter(p -> p.getSessions() != null)
                .map(p -> Long.valueOf(p.getSessions().getId()))
                .distinct()
                .collect(Collectors.toList());

        for (Long sessionId : sessionIds) {
            Sessions session = sessionsRepository.findById(sessionId).orElse(null);
            if (session != null && session.getDateDebut() != null && session.getDateFin() != null) {
                long dureeEnHeures = java.time.Duration.between(session.getDateDebut(), session.getDateFin()).toHours();
                nombreHeuresFormation += dureeEnHeures;
            }
        }

        financialData.setNombreHeuresFormation(nombreHeuresFormation);

        return financialData;
    }

    @Scheduled(cron = "0 0 1 * * ?") // Premier jour du mois à minuit
    public void generateMonthlyFinancialData() {
        // Calculer le premier et le dernier jour du mois précédent
        LocalDate now = LocalDate.now();
        LocalDate firstDayOfLastMonth = now.minusMonths(1).with(TemporalAdjusters.firstDayOfMonth());
        LocalDate lastDayOfLastMonth = now.minusMonths(1).with(TemporalAdjusters.lastDayOfMonth());

        // Générer les données financières
        FinancialData financialData = generateFinancialDataForPeriod(firstDayOfLastMonth, lastDayOfLastMonth);

        if (financialData != null) {
            // Enregistrer les données financières dans la base de données
            financialDataRepository.save(financialData);
            log.info("Données financières générées pour la période du {} au {}", firstDayOfLastMonth,
                    lastDayOfLastMonth);
        }
    }

    public void generateHistoricalFinancialData(int nombreMois) {
        LocalDate now = LocalDate.now();

        for (int i = 1; i <= nombreMois; i++) {
            LocalDate firstDayOfMonth = now.minusMonths(i).with(TemporalAdjusters.firstDayOfMonth());
            LocalDate lastDayOfMonth = now.minusMonths(i).with(TemporalAdjusters.lastDayOfMonth());

            FinancialData existingData = financialDataRepository.findByDate(lastDayOfMonth);
            if (existingData == null) {
                FinancialData financialData = generateFinancialDataForPeriod(firstDayOfMonth, lastDayOfMonth);
                if (financialData != null) {
                    financialDataRepository.save(financialData);
                    log.info("Données financières historiques générées pour la période du {} au {}",
                            firstDayOfMonth, lastDayOfMonth);
                }
            } else {
                log.info("Des données financières existent déjà pour la période du {} au {}",
                        firstDayOfMonth, lastDayOfMonth);
            }
        }
    }

    public List<FinancialData> getAllFinancialData() {
        return financialDataRepository.findAll();
    }
}
 */