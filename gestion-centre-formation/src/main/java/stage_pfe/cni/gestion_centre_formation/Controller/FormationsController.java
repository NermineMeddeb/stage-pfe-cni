package stage_pfe.cni.gestion_centre_formation.Controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import stage_pfe.cni.gestion_centre_formation.Controller.Api.FormationsApi;
import stage_pfe.cni.gestion_centre_formation.Dto.FormationsDto;
import stage_pfe.cni.gestion_centre_formation.Services.FormationsServices;

@RestController
@RequestMapping("/api/formations")
@CrossOrigin("*")
public class FormationsController implements FormationsApi {

    private final FormationsServices formationsServices;

    @Autowired
    public FormationsController(FormationsServices formationsServices) {
        this.formationsServices = formationsServices;
    }

    @Override
    public FormationsDto save(FormationsDto dto) {
        return formationsServices.save(dto);
    }

    @Override
    public FormationsDto findById(Long id) {
        return formationsServices.findById(id);
    }

    @Override
    public List<FormationsDto> findAll() {
        return formationsServices.findAll();
    }

    /*
     * @Override
     * public List<FormationsDto> findByThemeId(Long themeId) {
     * return formationsServices.findByThemeId(themeId);
     * }
     */
    @Override
    public List<FormationsDto> findByNiveau(String niveau) {
        return formationsServices.findByNiveau(niveau);
    }

    @Override
    public List<FormationsDto> findByStatut(String statut) {
        return formationsServices.findByStatut(statut);
    }

    @Override
    public long countFormations() {
        return formationsServices.countFormations();
    }

    @Override
    public List<FormationsDto> findByPrixBetween(Double minPrix, Double maxPrix) {
        return formationsServices.findByPrixBetween(minPrix, maxPrix);
    }

    @Override
    public List<FormationsDto> searchFormations(String keyword) {
        return formationsServices.searchFormations(keyword);
    }

    /*
     * @Override
     * public boolean isFormationAvailable(@PathVariable Long id,
     * 
     * @RequestParam LocalDate startDate,
     * 
     * @RequestParam LocalDate endDate) {
     * return formationsServices.isFormationAvailable(id, startDate, endDate);
     * }
     */
    @GetMapping("/formations/sortByDuree")
    public List<FormationsDto> sortFormationsByDuree(
            @RequestParam(name = "ascending", defaultValue = "true") boolean ascending) {
        return formationsServices.sortByDuree(ascending);
    }

    @Override
    public void delete(Long id) {
        formationsServices.delete(id);
    }

    /*
     * @Override
     * public void deleteOldCancelledFormations(LocalDate date) {
     * formationsServices.deleteOldCancelledFormations(date);
     * }
     */
}
