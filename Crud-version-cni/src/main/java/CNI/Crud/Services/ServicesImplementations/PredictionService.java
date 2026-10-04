/* package CNI.Crud.Services.ServicesImplementations;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.math3.stat.regression.OLSMultipleLinearRegression;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import CNI.Crud.Model.FinancialData;
import CNI.Crud.Repository.financialDataRepository;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PredictionService {

    private OLSMultipleLinearRegression regressionChiffreAffaire;
    private OLSMultipleLinearRegression regressionCoutFormateur;
    private OLSMultipleLinearRegression regressionCoutEmploye;

    @Autowired
    private financialDataRepository financialDataRepository;

    @Autowired
    private FinancialDataService financialDataService;

    @PostConstruct
    public void initModels() {
        // Générer des données historiques si nécessaire (pour les tests ou le démarrage
        // initial)
        if (financialDataRepository.count() < 12) {
            log.info("Données financières insuffisantes. Génération de données historiques...");
            financialDataService.generateHistoricalFinancialData(12); // Générer un an de données
        }

        trainModels();
    }

    public void trainModels() {
        List<FinancialData> allData = financialDataRepository.findAll();

        if (allData.size() < 3) {
            log.warn("Données insuffisantes pour entraîner les modèles (minimum 3 points requis, {} disponibles)",
                    allData.size());
            return;
        }

        log.info("Entraînement des modèles de prédiction avec {} points de données", allData.size());

        try {
            // Préparation des données pour l'entraînement
            double[][] explanatoryVariables = new double[allData.size()][];
            double[] chiffreAffaireValues = new double[allData.size()];
            double[] coutFormateurValues = new double[allData.size()];
            double[] coutEmployeValues = new double[allData.size()];

            for (int i = 0; i < allData.size(); i++) {
                FinancialData data = allData.get(i);

                // Variables explicatives (features)
                explanatoryVariables[i] = new double[] {
                        data.getNombreClients() != null ? data.getNombreClients() : 0,
                        data.getNombreFormations() != null ? data.getNombreFormations() : 0,
                        data.getNombreEmployes() != null ? data.getNombreEmployes() : 0,
                        data.getNombreHeuresFormation() != null ? data.getNombreHeuresFormation() : 0
                };

                // Variables à prédire (targets)
                chiffreAffaireValues[i] = data.getChiffreAffaire() != null ? data.getChiffreAffaire() : 0;
                coutFormateurValues[i] = data.getCoutFormateur() != null ? data.getCoutFormateur() : 0;
                coutEmployeValues[i] = data.getCoutEmploye() != null ? data.getCoutEmploye() : 0;
            }

            // Entrainement des modèles
            regressionChiffreAffaire = new OLSMultipleLinearRegression();
            regressionChiffreAffaire.newSampleData(chiffreAffaireValues, explanatoryVariables);

            regressionCoutFormateur = new OLSMultipleLinearRegression();
            regressionCoutFormateur.newSampleData(coutFormateurValues, explanatoryVariables);

            regressionCoutEmploye = new OLSMultipleLinearRegression();
            regressionCoutEmploye.newSampleData(coutEmployeValues, explanatoryVariables);

            log.info("Modèles de prédiction entraînés avec succès");

            // Afficher les coefficients pour débogage
            logRegressionCoefficients();

        } catch (Exception e) {
            log.error("Erreur lors de l'entraînement des modèles: {}", e.getMessage(), e);
        }
    }

    private void logRegressionCoefficients() {
        if (regressionChiffreAffaire != null) {
            double[] caParams = regressionChiffreAffaire.estimateRegressionParameters();
            log.info(
                    "Coefficients pour le chiffre d'affaires: Intercept={}, NombreClients={}, NombreFormations={}, NombreEmployes={}, NombreHeuresFormation={}",
                    caParams[0], caParams[1], caParams[2], caParams[3], caParams[4]);
        }

        if (regressionCoutFormateur != null) {
            double[] cfParams = regressionCoutFormateur.estimateRegressionParameters();
            log.info(
                    "Coefficients pour le coût formateur: Intercept={}, NombreClients={}, NombreFormations={}, NombreEmployes={}, NombreHeuresFormation={}",
                    cfParams[0], cfParams[1], cfParams[2], cfParams[3], cfParams[4]);
        }

        if (regressionCoutEmploye != null) {
            double[] ceParams = regressionCoutEmploye.estimateRegressionParameters();
            log.info(
                    "Coefficients pour le coût employé: Intercept={}, NombreClients={}, NombreFormations={}, NombreEmployes={}, NombreHeuresFormation={}",
                    ceParams[0], ceParams[1], ceParams[2], ceParams[3], ceParams[4]);
        }
    }

    public Map<String, Double> predictNextMonth() {
        // Calculer les moyennes des 3 derniers mois comme base pour la prédiction
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusMonths(3).with(TemporalAdjusters.firstDayOfMonth());
        LocalDate endDate = today.with(TemporalAdjusters.lastDayOfMonth());

        List<FinancialData> recentData = financialDataRepository.findByDateBetween(startDate, endDate);

        if (recentData.isEmpty()) {
            throw new IllegalStateException("Données récentes insuffisantes pour faire une prédiction");
        }

        // Calculer les moyennes
        double avgNombreClients = recentData.stream()
                .mapToInt(fd -> fd.getNombreClients() != null ? fd.getNombreClients() : 0)
                .average()
                .orElse(0);

        double avgNombreFormations = recentData.stream()
                .mapToInt(fd -> fd.getNombreFormations() != null ? fd.getNombreFormations() : 0)
                .average()
                .orElse(0);

        double avgNombreEmployes = recentData.stream()
                .mapToInt(fd -> fd.getNombreEmployes() != null ? fd.getNombreEmployes() : 0)
                .average()
                .orElse(0);

        double avgNombreHeuresFormation = recentData.stream()
                .mapToInt(fd -> fd.getNombreHeuresFormation() != null ? fd.getNombreHeuresFormation() : 0)
                .average()
                .orElse(0);

        // Appliquer une légère tendance basée sur l'évolution récente
        if (recentData.size() >= 2) {
            // Calculer la tendance en comparant le mois le plus récent avec la moyenne
            FinancialData mostRecent = recentData.stream()
                    .max((fd1, fd2) -> fd1.getDate().compareTo(fd2.getDate()))
                    .orElse(null);

            if (mostRecent != null) {
                double trendFactor = 1.05; // Facteur de tendance de 5%

                if (mostRecent.getNombreClients() > avgNombreClients) {
                    avgNombreClients *= trendFactor;
                }

                if (mostRecent.getNombreFormations() > avgNombreFormations) {
                    avgNombreFormations *= trendFactor;
                }

                if (mostRecent.getNombreHeuresFormation() > avgNombreHeuresFormation) {
                    avgNombreHeuresFormation *= trendFactor;
                }
            }
        }

        // Arrondir les valeurs
        int predictedNombreClients = (int) Math.round(avgNombreClients);
        int predictedNombreFormations = (int) Math.round(avgNombreFormations);
        int predictedNombreEmployes = (int) Math.round(avgNombreEmployes);
        int predictedNombreHeuresFormation = (int) Math.round(avgNombreHeuresFormation);

        // Faire la prédiction
        return predict(
                predictedNombreClients,
                predictedNombreFormations,
                predictedNombreEmployes,
                predictedNombreHeuresFormation);
    }

    public Map<String, Double> predict(int nombreClients, int nombreFormations,
            int nombreEmployes, int nombreHeuresFormation) {

        if (regressionChiffreAffaire == null || regressionCoutFormateur == null || regressionCoutEmploye == null) {
            trainModels(); // Essayer d'entraîner les modèles s'ils ne sont pas initialisés

            if (regressionChiffreAffaire == null) {
                throw new IllegalStateException("Les modèles n'ont pas été entraînés, données insuffisantes");
            }
        }

        double[] predictorValues = new double[] {
                nombreClients,
                nombreFormations,
                nombreEmployes,
                nombreHeuresFormation
        };

        Map<String, Double> predictions = new HashMap<>();

        try {
            // Prédictions
            double predictedCA = calculatePrediction(regressionChiffreAffaire, predictorValues);
            double predictedCF = calculatePrediction(regressionCoutFormateur, predictorValues);
            double predictedCE = calculatePrediction(regressionCoutEmploye, predictorValues);
            double predictedProfit = predictedCA - predictedCF - predictedCE;

            // S'assurer que les prédictions sont positives (ou au moins pas trop négatives)
            predictedCA = Math.max(predictedCA, 0);
            predictedCF = Math.max(predictedCF, 0);
            predictedCE = Math.max(predictedCE, 0);

            predictions.put("chiffreAffaire", predictedCA);
            predictions.put("coutFormateur", predictedCF);
            predictions.put("coutEmploye", predictedCE);
            predictions.put("profit", predictedProfit);

            log.info(
                    "Prédiction générée: CA={}, CF={}, CE={}, Profit={} pour paramètres: clients={}, formations={}, employés={}, heures={}",
                    String.format("%.2f", predictedCA),
                    String.format("%.2f", predictedCF),
                    String.format("%.2f", predictedCE),
                    String.format("%.2f", predictedProfit),
                    nombreClients, nombreFormations, nombreEmployes, nombreHeuresFormation);
        } catch (Exception e) {
            log.error("Erreur lors de la prédiction: {}", e.getMessage(), e);
            throw new RuntimeException("Erreur lors de la prédiction: " + e.getMessage(), e);
        }

        return predictions;
    }

    private double calculatePrediction(OLSMultipleLinearRegression model, double[] predictors) {
        double[] parameters = model.estimateRegressionParameters();
        double prediction = parameters[0]; // Intercept
        for (int i = 0; i < predictors.length; i++) {
            prediction += parameters[i + 1] * predictors[i];
        }
        return prediction;
    }

} */