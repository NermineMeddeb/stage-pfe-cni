package CNI.Crud.Controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import CNI.Crud.Controller.Api.FormationsApi;
import CNI.Crud.Dto.FormationsDto;
import CNI.Crud.Model.Formations;
import CNI.Crud.Services.FormationsServices;

@CrossOrigin(origins = "http://localhost:4200")

@RestController
@RequestMapping("/api/formations")
public class FormationsController implements FormationsApi {

    private final FormationsServices formationsServices;

    @Autowired
    public FormationsController(FormationsServices formationsServices) {
        this.formationsServices = formationsServices;
    }

    @Override
    public List<FormationsDto> findAllFormations() {
        return formationsServices.findAllFormations();
    }

    @Override
    public FormationsDto saveFormation(FormationsDto dto) {
        return formationsServices.saveFormation(dto);
    }

    @Override
    public FormationsDto updateFormation(FormationsDto dto) {
        return formationsServices.updateFormation(dto);
    }

    @Override
    public List<FormationsDto> findByNiveau(String niveau) {
        return formationsServices.findByNiveau(niveau);
    }

    @Override
    public List<FormationsDto> findByStatut(String statut) {
        return formationsServices.findByStatut(statut);
    }

    @Override
    public List<FormationsDto> findByPrixBetween(Double minPrix, Double maxPrix) {
        return formationsServices.findByPrixBetween(minPrix, maxPrix);
    }

    @Override
    public List<FormationsDto> searchFormations(String keyword) {
        return formationsServices.searchFormations(keyword);
    }

    @Override
    public long countFormations() {
        return formationsServices.countFormations();
    }

    @Override
    public List<FormationsDto> findByThemeId(Long themeId) {
        return formationsServices.findByTheme(themeId);
    }

    @GetMapping("/formations/sortByDuree")
    public List<FormationsDto> sortFormationsByDuree(
            @RequestParam(name = "ascending", defaultValue = "true") boolean ascending) {
        return formationsServices.sortByDuree(ascending);
    }

    @Override
    public void deleteFormation(Long id) {
        formationsServices.deleteFormation(id);
    }

    @Override
    public FormationsDto findFormationById(Long id) {
        return formationsServices.findFormationById(id);
    }

    @Override
    public List<FormationsDto> getFormationsByUserId(@PathVariable Long userId) {
        return formationsServices.getFormationsByUserId(userId);
    }

}
