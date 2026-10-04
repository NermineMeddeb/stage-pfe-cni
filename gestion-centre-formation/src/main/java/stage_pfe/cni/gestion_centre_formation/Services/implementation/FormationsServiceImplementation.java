package stage_pfe.cni.gestion_centre_formation.Services.implementation;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import lombok.extern.slf4j.Slf4j;
import stage_pfe.cni.gestion_centre_formation.Dto.FormationsDto;
import stage_pfe.cni.gestion_centre_formation.Model.Formations;
import stage_pfe.cni.gestion_centre_formation.Exceptions.EntityNotFoundException;
import stage_pfe.cni.gestion_centre_formation.Exceptions.ErrorCodes;
import stage_pfe.cni.gestion_centre_formation.Exceptions.InvalidEntityException;
import stage_pfe.cni.gestion_centre_formation.Repository.FormationsRepository;
//import stage_pfe.cni.gestion_centre_formation.Repository.InscriptionRepository;
//import stage_pfe.cni.gestion_centre_formation.Repository.ThemesRepository;
import stage_pfe.cni.gestion_centre_formation.Services.FormationsServices;
import stage_pfe.cni.gestion_centre_formation.Validateur.FormationsValidateur;

@Service
@Slf4j
public class FormationsServiceImplementation implements FormationsServices {

    // private final ThemesRepository themesRepository;
    // private final InscriptionRepository inscriptionRepository;
    private final FormationsRepository formationsRepository;

    @Autowired
    public FormationsServiceImplementation(
            // ThemesRepository themesRepository,
            FormationsRepository formationsRepository) {
        // InscriptionRepository inscriptionRepository)
        // this.themesRepository = themesRepository;
        this.formationsRepository = formationsRepository;
        // this.inscriptionRepository = inscriptionRepository;
    }

    @Override
    public FormationsDto save(FormationsDto dto) {
        List<String> errors = FormationsValidateur.validate(dto);
        if (!errors.isEmpty()) {
            log.error("Formation is not valid {}", dto);
            throw new InvalidEntityException(
                    "Formation is not valid",
                    ErrorCodes.FORMATION_NOT_VALID,
                    errors);
        }

        try {
            return FormationsDto.fromEntity(
                    formationsRepository.save(
                            FormationsDto.toEntity(dto)));
        } catch (Exception e) {
            throw new InvalidEntityException(
                    "Error while saving formation",
                    e,
                    ErrorCodes.FORMATION_SAVE_ERROR);
        }
    }

    @Override
    public FormationsDto findById(Long id) {
        if (id == null) {
            log.error("Formation ID is null");
            throw new InvalidEntityException(
                    "Formation ID cannot be null",
                    ErrorCodes.FORMATION_NOT_VALID);
        }

        return formationsRepository.findById(id)
                .map(FormationsDto::fromEntity)
                .orElseThrow(() -> new EntityNotFoundException(
                        "No Formation found with ID = " + id,
                        ErrorCodes.FORMATION_NOT_FOUND));
    }

    @Override
    public List<FormationsDto> findAll() {
        try {
            return formationsRepository.findAll().stream()
                    .map(FormationsDto::fromEntity)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new InvalidEntityException(
                    "Error while fetching formations",
                    e,
                    ErrorCodes.FORMATION_FETCH_ERROR);
        }
    }


    @Override
    public List<FormationsDto> findByNiveau(String niveau) {
        if (!StringUtils.hasText(niveau)) {
            throw new InvalidEntityException(
                    "Niveau cannot be null or empty",
                    ErrorCodes.FORMATION_NOT_VALID);
        }

        return formationsRepository.findByNiveau(niveau).stream()
                .map(FormationsDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<FormationsDto> findByPrixBetween(Double minPrix, Double maxPrix) {
        if (minPrix == null || maxPrix == null) {
            throw new InvalidEntityException(
                    "Price range parameters cannot be null",
                    ErrorCodes.FORMATION_NOT_VALID);
        }

        return formationsRepository.findByPrixBetween(minPrix, maxPrix).stream()
                .map(FormationsDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<FormationsDto> searchFormations(String keyword) {
        if (!StringUtils.hasText(keyword)) {
            throw new InvalidEntityException(
                    "Search keyword cannot be null or empty",
                    ErrorCodes.FORMATION_NOT_VALID);
        }

        return formationsRepository.searchFormations(keyword).stream()
                .map(FormationsDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<FormationsDto> findByStatut(String statut) {
        if (!StringUtils.hasText(statut)) {
            throw new InvalidEntityException(
                    "Statut cannot be null or empty",
                    ErrorCodes.FORMATION_NOT_VALID);
        }
        return formationsRepository.findByStatut(statut).stream()
                .map(FormationsDto::fromEntity)
                .collect(Collectors.toList());
    }
    /*
     * 
     * @Override
     * public List<FormationsDto> findByPlacesMin(int placesMin) {
     * return formationsRepository.findByPlacesMin(placesMin).stream()
     * .map(FormationsDto::fromEntity)
     * .collect(Collectors.toList());
     * }
     * 
     * @Override
     * public List<FormationsDto> findByTheme(Long themeId) {
     * if (themeId == null) {
     * throw new InvalidEntityException(
     * "Theme ID cannot be null",
     * ErrorCodes.FORMATION_NOT_VALID);
     * }
     * return formationsRepository.findByThemeId(themeId).stream()
     * .map(FormationsDto::fromEntity)
     * .collect(Collectors.toList());
     * }
     */
    /*
     * @Override
     * public boolean isFormationAvailable(Long formationId, LocalDate startDate,
     * LocalDate endDate) {
     * if (formationId == null || startDate == null || endDate == null) {
     * throw new InvalidEntityException(
     * "All parameters are required for availability check",
     * ErrorCodes.FORMATION_NOT_VALID);
     * }
     * return inscriptionRepository.checkFormationAvailability(formationId,
     * startDate, endDate);
     * }
     */
    /*
     * @Override
     * public List<FormationsDto> searchFormations(String keyword) {
     * if (!StringUtils.hasText(keyword)) {
     * throw new InvalidEntityException(
     * "Search keyword cannot be null or empty",
     * ErrorCodes.FORMATION_NOT_VALID);
     * }
     * return formationsRepository.searchFormations(keyword).stream()
     * .map(FormationsDto::fromEntity)
     * .collect(Collectors.toList());
     * }
     * 
     * @Override
     * public List<FormationsDto> sortByPrix(boolean ascending) {
     * return (ascending ? formationsRepository.findAllByOrderByPrixAsc()
     * : formationsRepository.findAllByOrderByPrixDesc())
     * .stream()
     * .map(FormationsDto::fromEntity)
     * .collect(Collectors.toList());
     * }
     */

    @Override
    public List<FormationsDto> sortByDuree(boolean ascending) {
        // Si ascending est vrai, on récupère les formations triées par durée
        // croissante,
        // sinon, on les trie par durée décroissante.
        List<Formations> formationsList = ascending ? formationsRepository.findAllByOrderByDureeAsc()
                : formationsRepository.findAllByOrderByDureeDesc();

        // Conversion de la liste des entités en liste des DTOs
        return formationsList.stream()
                .map(FormationsDto::fromEntity) // Convertir chaque formation en FormationsDto
                .collect(Collectors.toList()); // Collecte et retourne la liste des DTOs
    }

    @Override
    public long countFormations() {
        return formationsRepository.count();
    }

    /*
     * @Override
     * public List<FormationsDto> findByNiveauAndPrix(String niveau, Double maxPrix)
     * {
     * if (!StringUtils.hasText(niveau) || maxPrix == null) {
     * throw new InvalidEntityException(
     * "Niveau and maxPrix cannot be null",
     * ErrorCodes.FORMATION_NOT_VALID);
     * }
     * return formationsRepository.findByNiveauAndPrixLessThanEqual(niveau,
     * maxPrix).stream()
     * .map(FormationsDto::fromEntity)
     * .collect(Collectors.toList());
     * }
     */

    @Override
    public void delete(Long id) {
        if (id == null) {
            throw new InvalidEntityException(
                    "Formation ID cannot be null",
                    ErrorCodes.FORMATION_NOT_VALID);
        }

        Formations formation = formationsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "No Formation found with ID = " + id,
                        ErrorCodes.FORMATION_NOT_FOUND));

        /*
         * if (inscriptionRepository.hasActiveInscriptions(id)) {
         * throw new InvalidEntityException(
         * "Cannot delete Formation with active inscriptions",
         * ErrorCodes.FORMATION_ALREADY_IN_USE);
         * }
         */

        try {
            formationsRepository.deleteById(id);
            log.info("Formation with ID {} has been deleted", id);
        } catch (Exception e) {
            throw new InvalidEntityException(
                    "Error while deleting formation",
                    e,
                    ErrorCodes.FORMATION_DELETE_ERROR);
        }
    }
}