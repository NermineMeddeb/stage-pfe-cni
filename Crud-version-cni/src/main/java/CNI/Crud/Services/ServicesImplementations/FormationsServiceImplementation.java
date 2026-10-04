package CNI.Crud.Services.ServicesImplementations;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import CNI.Crud.Dto.FormationsDto;
import CNI.Crud.Exceptions.*;
import CNI.Crud.Model.Formations;
import CNI.Crud.Model.Inscription;
import CNI.Crud.Model.Sessions;
import CNI.Crud.Model.Themes;
import CNI.Crud.Repository.CertificatsRepository;
import CNI.Crud.Repository.FormationsRepository;
import CNI.Crud.Repository.InscriptionRepository;
import CNI.Crud.Repository.PaiementsRepository;
import CNI.Crud.Repository.SessionsRepository;
import CNI.Crud.Repository.ThemesRepository;
import CNI.Crud.Services.FormationsServices;
import CNI.Crud.Validateur.FormationsValidateur;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class FormationsServiceImplementation implements FormationsServices {

    private final FormationsRepository formationsRepository;
    private final ThemesRepository themesRepository;
    private final SessionsRepository sessionsRepository;
    private final InscriptionRepository inscriptionsRepository;
    private final PaiementsRepository paiementsRepository;
    private final CertificatsRepository certificatsRepository;

    @Autowired
    public FormationsServiceImplementation(
            FormationsRepository formationsRepository, ThemesRepository themesRepository,
            SessionsRepository sessionsRepository, InscriptionRepository inscriptionsRepository,
            PaiementsRepository paiementsRepository, CertificatsRepository certificatsRepository) {
        this.certificatsRepository = certificatsRepository;
        this.sessionsRepository = sessionsRepository;
        this.formationsRepository = formationsRepository;
        this.themesRepository = themesRepository;
        this.inscriptionsRepository = inscriptionsRepository;
        this.paiementsRepository = paiementsRepository;

    }

    @Override
    public List<FormationsDto> findAllFormations() {
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
    public FormationsDto findFormationById(Long id) {
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
    public FormationsDto updateFormation(FormationsDto dto) {
        if (dto == null || dto.getId() == null) {
            throw new InvalidEntityException("Les données de la formation sont invalides",
                    ErrorCodes.FORMATION_NOT_VALID, List.of("Formation ID est requis"));
        }

        // Vérifier si la formation existe
        Formations existingFormation = formationsRepository.findById(dto.getId())
                .orElseThrow(() -> new EntityNotFoundException("Formation non trouvée avec ID : " + dto.getId(),
                        ErrorCodes.FORMATION_NOT_FOUND));

        // Mise à jour des champs de la formation
        if (dto.getTitre() != null) {
            existingFormation.setTitre(dto.getTitre());
        }
        if (dto.getDescription() != null) {
            existingFormation.setDescription(dto.getDescription());
        }
        if (dto.getDuree() != null) {
            existingFormation.setDuree(dto.getDuree());
        }
        if (dto.getPrix() != null) {
            existingFormation.setPrix(dto.getPrix());
        }
        if (dto.getNiveau() != null) {
            existingFormation.setNiveau(dto.getNiveau());
        }
        if (dto.getPrerequis() != null) {
            existingFormation.setPrerequis(dto.getPrerequis());
        }
        if (dto.getStatut() != null) {
            existingFormation.setStatut(dto.getStatut());
        }
        if (dto.getPlacesMax() != null) {
            existingFormation.setPlacesMax(dto.getPlacesMax());
        }
        if (dto.getObjectifsFormation() != null) {
            existingFormation.setObjectifsFormation(dto.getObjectifsFormation());
        }
        if (dto.getProgrammeDetaille() != null) {
            existingFormation.setProgrammeDetaille(dto.getProgrammeDetaille());
        }
        if (dto.getPhoto() != null) {
            existingFormation.setPhoto(dto.getPhoto());
        }

        // Mise à jour du thème si un nouvel ID est fourni
        if (dto.getThemeId() != null) {
            Themes theme = themesRepository.findById(dto.getThemeId())
                    .orElseThrow(() -> new EntityNotFoundException("Thème non trouvé avec ID : " + dto.getThemeId(),
                            ErrorCodes.THEME_NOT_FOUND));
            existingFormation.setTheme(theme);
        }

        // Sauvegarde de la formation mise à jour
        Formations updatedFormation = formationsRepository.save(existingFormation);

        return FormationsDto.fromEntity(updatedFormation);
    }

    @Override
    public FormationsDto saveFormation(FormationsDto dto) {
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

    @Override
    public List<FormationsDto> findByTheme(Long themeId) {
        if (themeId == null) {
            throw new InvalidEntityException(
                    "Theme ID cannot be null",
                    ErrorCodes.FORMATION_NOT_VALID);
        }
        return formationsRepository.findByThemeId(themeId).stream()
                .map(FormationsDto::fromEntity)
                .collect(Collectors.toList());
    }

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

    @Override
    public List<FormationsDto> sortByPrix(boolean ascending) {
        return (ascending ? formationsRepository.findAllByOrderByPrixAsc()
                : formationsRepository.findAllByOrderByPrixDesc())
                .stream()
                .map(FormationsDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteFormation(Long id) {
        if (id == null) {
            throw new InvalidEntityException(
                    "Formation ID cannot be null",
                    ErrorCodes.FORMATION_NOT_VALID);
        }

        Formations formation = formationsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "No Formation found with ID = " + id,
                        ErrorCodes.FORMATION_NOT_FOUND));

        try {
            List<Sessions> sessions = sessionsRepository.findByFormationId(id);
            for (Sessions session : sessions) {
                List<Inscription> inscriptions = inscriptionsRepository.findBySessionId(session.getId());

                for (Inscription inscription : inscriptions) {
                    certificatsRepository.deleteAllByInscriptionId(inscription.getId());
                }

                inscriptionsRepository.deleteAllBySessionId(session.getId());

                paiementsRepository.deleteAllBySessionsId(session.getId());
            }

            sessionsRepository.deleteAll(sessions);

            formationsRepository.deleteById(id);

            log.info("Formation with ID {} has been deleted", id);
        } catch (Exception e) {
            throw new InvalidEntityException(
                    "Error while deleting formation",
                    e,
                    ErrorCodes.FORMATION_DELETE_ERROR);
        }
    }

    @Override
    public List<FormationsDto> getFormationsByUserId(Long userId) {
        return formationsRepository.findFormationsByUserId(userId)
                .stream()
                .map(FormationsDto::fromEntity)
                .collect(Collectors.toList());
    }

}