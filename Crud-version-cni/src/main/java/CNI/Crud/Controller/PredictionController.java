/*
 * package CNI.Crud.Controller;
 * 
 * import java.time.LocalDate;
 * import java.util.HashMap;
 * import java.util.List;
 * import java.util.Map;
 * 
 * import org.springframework.beans.factory.annotation.Autowired;
 * import org.springframework.format.annotation.DateTimeFormat;
 * import org.springframework.http.ResponseEntity;
 * import org.springframework.web.bind.annotation.GetMapping;
 * import org.springframework.web.bind.annotation.PathVariable;
 * import org.springframework.web.bind.annotation.PostMapping;
 * import org.springframework.web.bind.annotation.RequestMapping;
 * import org.springframework.web.bind.annotation.RequestParam;
 * import org.springframework.web.bind.annotation.RestController;
 * 
 * import CNI.Crud.Model.FinancialData;
 * import
 * CNI.Crud.Services.ServicesImplementations.FinancialDataAggregationService;
 * import CNI.Crud.Services.ServicesImplementations.FinancialDataService;
 * import CNI.Crud.Services.ServicesImplementations.PaiementsServiceImpl;
 * import CNI.Crud.Services.ServicesImplementations.PredictionService;
 * 
 * 
 * @RestController
 * 
 * @RequestMapping("/api/predictions")
 * public class PredictionController {
 * 
 * private final PaiementsServiceImpl paiementsService;
 * private final FinancialDataService financialDataService;
 * private final PredictionService predictionService;
 * private final FinancialDataAggregationService aggregationService;
 * 
 * 
 * public PredictionController(PaiementsServiceImpl paiementsService,
 * FinancialDataService financialDataService, PredictionService
 * predictionService, FinancialDataAggregationService aggregationService) {
 * this.paiementsService = paiementsService;
 * this.financialDataService = financialDataService;
 * this.predictionService = predictionService;
 * this.aggregationService = aggregationService;
 * }
 * 
 * @GetMapping("/summary")
 * public ResponseEntity<Map<String, Object>> getFinancialSummary() {
 * Map<String, Object> summary = new HashMap<>();
 * 
 * // Données historiques réelles
 * summary.put("chiffreAffaireTotal", paiementsService.ChiffreAffaireTotal());
 * summary.put("coutFormateursTotal",
 * paiementsService.coutTotalDesFormateursExterne() +
 * paiementsService.coutTotalDesFormateursInterne());
 * summary.put("coutEmployesTotal", paiementsService.coutTotalDesEmployee());
 * summary.put("revenuMoyenParEtudiant",
 * paiementsService.revenuMoyenParEtudiant());
 * summary.put("revenuMoyenParSession",
 * paiementsService.revenuMoyenParSession());
 * summary.put("coutMoyenFormateur", paiementsService.CoutsMoyenDuFormateur());
 * 
 * return ResponseEntity.ok(summary);
 * }
 * 
 * @GetMapping("/period")
 * public ResponseEntity<Map<String, Object>> getFinancialByPeriod(
 * 
 * @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate debut,
 * 
 * @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
 * 
 * Map<String, Object> results = new HashMap<>();
 * 
 * // Données réelles pour la période
 * results.put("chiffreAffaire",
 * paiementsService.ChiffreAffaireEtudiantParPeriode(debut, fin));
 * results.put("coutFormateurs",
 * paiementsService.CoutsFormateursParPeriode(debut, fin));
 * results.put("coutEmployes", paiementsService.CoutsEmployesParPeriode(debut,
 * fin));
 * results.put("profit", paiementsService.calculerProfitTotal(debut, fin));
 * 
 * return ResponseEntity.ok(results);
 * }
 * 
 * @GetMapping("/historical-data")
 * public ResponseEntity<List<FinancialData>> getHistoricalData() {
 * return ResponseEntity.ok(financialDataService.getAllFinancialData());
 * }
 * 
 * @PostMapping("/generate-historical/{months}")
 * public ResponseEntity<String> generateHistoricalData(@PathVariable int
 * months) {
 * if (months <= 0 || months > 36) {
 * return
 * ResponseEntity.badRequest().body("Le nombre de mois doit être entre 1 et 36"
 * );
 * }
 * financialDataService.generateHistoricalFinancialData(months);
 * return ResponseEntity.ok("Génération de données historiques pour " + months +
 * " mois lancée avec succès");
 * }
 * 
 * @GetMapping("/predict/next-month")
 * public ResponseEntity<Map<String, Double>> predictNextMonth() {
 * try {
 * Map<String, Double> predictions = predictionService.predictNextMonth();
 * return ResponseEntity.ok(predictions);
 * } catch (Exception e) {
 * return ResponseEntity.badRequest().body(Map.of("error", 0.0));
 * }
 * }
 * 
 * @PostMapping("/predict/custom")
 * public ResponseEntity<Map<String, Double>> predictCustom(
 * 
 * @RequestParam int nombreClients,
 * 
 * @RequestParam int nombreFormations,
 * 
 * @RequestParam int nombreEmployes,
 * 
 * @RequestParam int nombreHeuresFormation) {
 * 
 * try {
 * Map<String, Double> predictions = predictionService.predict(
 * nombreClients, nombreFormations, nombreEmployes, nombreHeuresFormation);
 * return ResponseEntity.ok(predictions);
 * } catch (Exception e) {
 * return ResponseEntity.badRequest().body(Map.of("error", 0.0));
 * }
 * }
 * 
 * @PostMapping("/train-models")
 * public ResponseEntity<String> trainModels() {
 * try {
 * predictionService.trainModels();
 * return ResponseEntity.ok("Modèles entraînés avec succès");
 * } catch (Exception e) {
 * return ResponseEntity.badRequest().
 * body("Erreur lors de l'entraînement des modèles: " + e.getMessage());
 * }
 * }
 * 
 * @PostMapping("/aggregate")
 * public ResponseEntity<String> aggregateFinancialData(
 * 
 * @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate
 * startDate,
 * 
 * @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate
 * endDate) {
 * 
 * aggregationService.aggregateFinancialDataForPeriod(startDate, endDate);
 * return ResponseEntity.
 * ok("L'agrégation des données financières a été effectuée avec succès");
 * }
 * }
 */