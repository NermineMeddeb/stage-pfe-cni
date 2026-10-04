package stage_pfe.cni.gestion_centre_formation.Services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import stage_pfe.cni.gestion_centre_formation.Dto.FormationsDto;
import stage_pfe.cni.gestion_centre_formation.Model.Formations;

public interface FormationsServices {
    FormationsDto save(FormationsDto dto);

    FormationsDto findById(Long id);

    List<FormationsDto> findAll();

    List<FormationsDto> findByNiveau(String niveau);

    List<FormationsDto> findByPrixBetween(Double minPrix, Double maxPrix);

    void delete(Long id);

    public List<FormationsDto> findByStatut(String statut);

    // Trouver les formations ayant un nombre de places minimum
    // List<FormationsDto> findByPlacesMin(int placesMin);

    //List<FormationsDto> findByThemeId(Long themeId);

    // Vérifier si une formation est disponible à une date donnée
    // boolean isFormationAvailable(Long formationId, LocalDate startDate, LocalDate
    // endDate);

    List<FormationsDto> searchFormations(String keyword);

    // Trier les formations par prix (croissant/décroissant)
    // List<FormationsDto> sortByPrix(boolean ascending);

    List<FormationsDto> sortByDuree(boolean ascending);

    long countFormations();

    // Trouver les formations d'un certain niveau et d'un certain prix
    // List<FormationsDto> findByNiveauAndPrix(String niveau, Double maxPrix);
}
