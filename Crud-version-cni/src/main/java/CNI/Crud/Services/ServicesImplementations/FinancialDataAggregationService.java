/* package CNI.Crud.Services.ServicesImplementations;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import CNI.Crud.Model.FinancialData;
import CNI.Crud.Model.Paiements;
import CNI.Crud.Model.Role;
import CNI.Crud.Model.Sessions;
import CNI.Crud.Model.Utilisateurs;
import CNI.Crud.Repository.InscriptionRepository;
import CNI.Crud.Repository.financialDataRepository;
import CNI.Crud.Repository.PaiementsRepository;
import CNI.Crud.Repository.SessionsRepository;
import CNI.Crud.Repository.UtilisateursRepository;
import jakarta.transaction.Transactional;

@Service
public class FinancialDataAggregationService {

    @Autowired
    private PaiementsRepository paiementsRepository;

    @Autowired
    private SessionsRepository sessionsRepository;

    @Autowired
    private InscriptionRepository inscriptionRepository;

    @Autowired
    private UtilisateursRepository utilisateursRepository;

    @Autowired
    private financialDataRepository financialDataRepository;

  
    @Transactional
    public void aggregateFinancialDataForPeriod(LocalDate startDate, LocalDate endDate) {
        // 1. Récupérer tous les paiements de la période
        List<Paiements> paiements = paiementsRepository.findByDatePaiementBetween(startDate, endDate);

        // 2. Calculer le chiffre d'affaires (somme des montants des paiements)
        Double chiffreAffaire = paiements.stream()
                .mapToDouble(Paiements::getMontant)
                .sum();

        // 3. Calculer le coût des formateurs (internes et externes)
        Double coutFormateur = calculateFormateursExpenses(startDate, endDate);

        // 4. Calculer le coût des employés (administratifs)
        Double coutEmploye = calculateEmployeesExpenses(startDate, endDate);

        // 5. Compter le nombre de clients uniques (étudiants inscrits)
        Integer nombreClients = (int) paiements.stream()
                .map(p -> p.getUtilisateur().getId())
                .distinct()
                .count();

        // 6. Compter le nombre de formations/sessions uniques
        Integer nombreFormations = (int) paiements.stream()
                .map(p -> p.getSessions().getFormation().getId())
                .distinct()
                .count();

        // 7. Compter le nombre d'employés (formateurs + administratifs)
        Integer nombreEmployes = countActiveEmployees(startDate, endDate);

        // 8. Calculer le nombre d'heures de formation dispensées
        Integer nombreHeuresFormation = calculateTotalTrainingHours(startDate, endDate);

        // 9. Créer ou mettre à jour l'entrée FinancialData
        FinancialData financialData = financialDataRepository.findByDate(endDate);
        if (financialData == null) {
            financialData = new FinancialData();
            financialData.setDate(endDate);
        }

        financialData.setChiffreAffaire(chiffreAffaire);
        financialData.setCoutFormateur(coutFormateur);
        financialData.setCoutEmploye(coutEmploye);
        financialData.setNombreClients(nombreClients);
        financialData.setNombreFormations(nombreFormations);
        financialData.setNombreEmployes(nombreEmployes);
        financialData.setNombreHeuresFormation(nombreHeuresFormation);

        financialDataRepository.save(financialData);
    }

   
    private Double calculateFormateursExpenses(LocalDate startDate, LocalDate endDate) {
        // Ici, vous pouvez implémenter votre logique de calcul des coûts formateurs
        // Par exemple, vous pourriez avoir une table de salaires ou de prestations
        List<Utilisateurs> formateurs = utilisateursRepository.findByRoleIn(
                Arrays.asList(Role.INTERNE, Role.EXTERNE));

        // Calculer le coût total des formateurs selon votre logique métier
        // Par exemple, calculer le temps passé en formation × taux horaire
        return 0.0; // À compléter selon votre logique métier
    }

   
    private Double calculateEmployeesExpenses(LocalDate startDate, LocalDate endDate) {
        // Logique similaire pour les employés administratifs
        List<Utilisateurs> employees = utilisateursRepository.findByRole(Role.EMPLOYEE);

        // Calculer le coût total des employés selon votre logique métier
        return 0.0; // À compléter selon votre logique métier
    }

   
    private Integer countActiveEmployees(LocalDate startDate, LocalDate endDate) {
        // Retourne le nombre d'employés actifs durant la période
        return utilisateursRepository.countByRoleIn(
                Arrays.asList(Role.INTERNE, Role.EXTERNE, Role.EMPLOYEE));
    }

  
    private Integer calculateTotalTrainingHours(LocalDate startDate, LocalDate endDate) {
        // Récupérer toutes les sessions qui ont eu lieu (même partiellement) pendant la
        // période
        List<Sessions> sessions = sessionsRepository.findByDateDebutBetweenOrDateFinBetween(
                startDate.atStartOfDay(), endDate.atTime(23, 59, 59),
                startDate.atStartOfDay(), endDate.atTime(23, 59, 59));

        // Calculer la durée totale en heures
        int totalHours = 0;
        for (Sessions session : sessions) {
            // Convertir la durée de chaque session en heures et ajouter au total
            // Vous devrez adapter cette logique à votre modèle de données
            LocalDateTime sessionStart = session.getDateDebut();
            LocalDateTime sessionEnd = session.getDateFin();

            // Ne compter que la partie de la session qui se trouve dans la période demandée
            if (sessionStart.isBefore(startDate.atStartOfDay())) {
                sessionStart = startDate.atStartOfDay();
            }
            if (sessionEnd.isAfter(endDate.atTime(23, 59, 59))) {
                sessionEnd = endDate.atTime(23, 59, 59);
            }

            // Calculer la durée en heures
            long hours = java.time.Duration.between(sessionStart, sessionEnd).toHours();
            totalHours += hours;
        }

        return totalHours;
    }

 
    @Scheduled(cron = "0 0 1 1 * ?") // Exécuter le 1er de chaque mois à minuit
    public void scheduleMonthlyAggregation() {
        LocalDate today = LocalDate.now();
        LocalDate startOfLastMonth = today.minusMonths(1).withDayOfMonth(1);
        LocalDate endOfLastMonth = today.withDayOfMonth(1).minusDays(1);

        aggregateFinancialDataForPeriod(startOfLastMonth, endOfLastMonth);
    }
} */