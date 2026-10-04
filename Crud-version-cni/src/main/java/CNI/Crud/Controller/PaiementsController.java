package CNI.Crud.Controller;

import java.time.LocalDate ;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import CNI.Crud.Controller.Api.PaiementsApi;
import CNI.Crud.Dto.PaiementsDto;
import CNI.Crud.Services.PaiementsService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/paiements")
public class PaiementsController implements PaiementsApi {

    private final PaiementsService paiementsService;

    @Autowired
    public PaiementsController(PaiementsService paiementsService) {
        this.paiementsService = paiementsService;
    }

    @Override
    public List<PaiementsDto> findAllPaiements() {
        return paiementsService.findAllPaiements();
    }

    @Override
    public PaiementsDto savePaiement(@RequestBody PaiementsDto dto) {
        return paiementsService.savePaiement(dto);
    }

    @Override
    public PaiementsDto updatePaiement(@RequestBody PaiementsDto dto) {
        return paiementsService.updatePaiement(dto);
    }

    @Override
    public void deletePaiement(@PathVariable Long id) {
        paiementsService.deletePaiement(id);
    }

    @Override
    public PaiementsDto findPaiementById(@PathVariable Long id) {
        return paiementsService.findPaiementById(id);
    }

    @Override
    public Double ChiffreAffaireTotal() {
        return paiementsService.ChiffreAffaireTotal();
    }

    @Override
    public Double coutTotalDesFormateursExterne() {
        return paiementsService.coutTotalDesFormateursExterne();
    }

    @Override
    public Double coutTotalDesFormateursInterne() {
        return paiementsService.coutTotalDesFormateursInterne();
    }

    @Override
    public Double coutTotalDesEmployee() {
        return paiementsService.coutTotalDesEmployee();
    }

    @Override
    public Double CoutsMoyenDuFormateur() {
        return paiementsService.CoutsMoyenDuFormateur();
    }

    @Override
    public Double CoutsEstimes(@PathVariable Long formationId) {
        return paiementsService.CoutsEstimer(formationId);
    }

    @Override
    public Double ChiffreAffaireEtudiantParPeriode(
            @RequestParam LocalDate  debut,
            @RequestParam LocalDate  fin) {
        return paiementsService.ChiffreAffaireEtudiantParPeriode(debut, fin);
    }

    @Override
    public Double CoutsFormateursParPeriode(
            @RequestParam LocalDate  debut,
            @RequestParam LocalDate  fin) {
        return paiementsService.CoutsFormateursParPeriode(debut, fin);
    }

    @Override
    public Double revenuMoyenParSession() {
        return paiementsService.revenuMoyenParSession();
    }

    @Override
    public Double revenuMoyenParEtudiant() {
        return paiementsService.revenuMoyenParEtudiant();
    }

    @Override
    public Double calculerProfitTotal(@RequestParam LocalDate  debut,
            @RequestParam LocalDate  fin) {
        return paiementsService.calculerProfitTotal(debut, fin);
    }

    @Override
    public Double CoutsEmployesParPeriode(@RequestParam LocalDate  debut,
            @RequestParam LocalDate  fin) {
        return paiementsService.CoutsEmployesParPeriode(debut, fin);
    }

}