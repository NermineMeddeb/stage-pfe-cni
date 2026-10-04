package CNI.Crud.Services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import CNI.Crud.Dto.FormationsDto;

@Service
public interface FormationsServices {

    List<FormationsDto> findAllFormations();

    FormationsDto findFormationById(Long id);

    // FormationsDto saveFormation(FormationsDto dto);
    List<FormationsDto> findByNiveau(String niveau);

    List<FormationsDto> findByPrixBetween(Double minPrix, Double maxPrix);

    void deleteFormation(Long id);

    public List<FormationsDto> findByStatut(String statut);

    // List<FormationsDto> findByPlacesMin(int placesMin);

    List<FormationsDto> findByTheme(Long themeId);

    // Vérifier si une formation est disponible à une date donnée
    // boolean isFormationAvailable(Long formationId, LocalDate startDate, LocalDate
    // endDate);

    List<FormationsDto> searchFormations(String keyword);

    List<FormationsDto> sortByPrix(boolean ascending);

    List<FormationsDto> sortByDuree(boolean ascending);

    long countFormations();


}
