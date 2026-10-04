package CNI.Crud.Controller.Api;

import CNI.Crud.Dto.PaiementsDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate ;
import java.util.List;

public interface PaiementsApi {

    @GetMapping("/all")
    @Operation(summary = "Lister tous les paiements", description = "Permet de récupérer la liste complète des paiements enregistrés")
    List<PaiementsDto> findAllPaiements();

    @PostMapping("/save")
    @Operation(summary = "Créer un paiement", description = "Permet d'enregistrer un nouveau paiement dans le système")
    PaiementsDto savePaiement(@RequestBody PaiementsDto dto);

    @PostMapping("/updatePaiement")
    @Operation(summary = "Mettre à jour un paiement", description = "Permet de modifier les informations d'un paiement existant")
    PaiementsDto updatePaiement(@RequestBody PaiementsDto dto);

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un paiement", description = "Supprime un paiement à partir de son identifiant")
    void deletePaiement(@PathVariable("id") Long id);

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un paiement par ID", description = "Permet de récupérer les détails d'un paiement à partir de son ID")
    PaiementsDto findPaiementById(@PathVariable("id") Long id);

    @GetMapping("/ChiffreAffaireTotal")
    @Operation(summary = "Chiffre d'affaires global", description = "Retourne le chiffre d'affaires total généré par tous les paiements confirmés")
    Double ChiffreAffaireTotal();

    @GetMapping("/coutTotalDesFormateursExterne")
    @Operation(summary = "Coût total des formateurs externes", description = "Retourne le montant total payé aux formateurs externes")
    Double coutTotalDesFormateursExterne();

    @GetMapping("/coutTotalDesFormateursInterne")
    @Operation(summary = "Coût total des formateurs internes", description = "Retourne le montant total payé aux formateurs internes")
    Double coutTotalDesFormateursInterne();

    @GetMapping("/coutTotalDesEmployee")
    @Operation(summary = "Coût total des employés", description = "Retourne le montant total payé aux employés durant toute la période")
    Double coutTotalDesEmployee();

    @GetMapping("/CoutsMoyenDuFormateur")
    @Operation(summary = "Revenu moyen par formateur pour une formation", description = "Retourne le revenu moyen généré par les formateurs d'une formation spécifique")
    Double CoutsMoyenDuFormateur();

    @GetMapping("/couts-estimes/{formationId}")
    @Operation(summary = "Estimation des coûts pour une formation", description = "Retourne l'estimation totale des coûts associés à une formation")
    Double CoutsEstimes(@PathVariable("formationId") Long formationId);

    @GetMapping("/chiffre-affaire-periode")
    @Operation(summary = "Chiffre d'affaires par période", description = "Retourne le chiffre d'affaires généré par les étudiants pendant une période donnée")
    Double ChiffreAffaireEtudiantParPeriode(
            @RequestParam("debut") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate  debut,
            @RequestParam("fin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate  fin);

    @GetMapping("/CoutsFormateursParPeriode")
    @Operation(summary = "Coût des formateurs par période", description = "Retourne le total payé aux formateurs (internes et externes) durant une période donnée")
    Double CoutsFormateursParPeriode(
            @RequestParam("debut") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate  debut,
            @RequestParam("fin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate  fin);

    @GetMapping("/revenuMoyenParSession")
    @Operation(summary = "Revenu moyen par session", description = "Calcule le revenu moyen généré par session de formation")
    Double revenuMoyenParSession();

    @GetMapping("/revenuMoyenParEtudiant")
    @Operation(summary = "Revenu moyen par étudiant", description = "Retourne le revenu moyen généré par chaque étudiant sur l’ensemble des formations")
    Double revenuMoyenParEtudiant();

    @GetMapping("/calculerProfitTotal")
    @Operation(summary = "Profit net sur une période", description = "Calcule le profit net en soustrayant les coûts (formateurs, employés) du chiffre d'affaires pour une période donnée")
    Double calculerProfitTotal(
            @RequestParam("debut") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate  debut,
            @RequestParam("fin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate  fin);

    @GetMapping("/CoutsEmployesParPeriode")
    @Operation(summary = "Coût des employés par période", description = "Retourne le total des montants versés aux employés durant une période donnée")
    Double CoutsEmployesParPeriode(
            @RequestParam("debut") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate  debut,
            @RequestParam("fin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate  fin);
}
