package CNI.Crud.Services.ServicesImplementations;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import CNI.Crud.Dto.InscriptionDto;
import CNI.Crud.Exceptions.EntityNotFoundException;
import CNI.Crud.Exceptions.ErrorCodes;
import CNI.Crud.Exceptions.InvalidEntityException;
import CNI.Crud.Model.Inscription;
import CNI.Crud.Model.Sessions;
import CNI.Crud.Repository.InscriptionRepository;
import CNI.Crud.Repository.SessionsRepository;
import CNI.Crud.Services.InscriptionServices;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class InscriptionImplementation implements InscriptionServices {

    private final InscriptionRepository inscriptionRepository;
    private final SessionsRepository sessionRepository;


    @Autowired
    public InscriptionImplementation(InscriptionRepository inscriptionRepository, SessionsRepository sessionRepository) {
        this.inscriptionRepository = inscriptionRepository;
        this.sessionRepository = sessionRepository;
    }

    @Override
    public List<InscriptionDto> findAll() {
        try {
            return inscriptionRepository.findAll().stream()
                    .map(InscriptionDto::fromEntity)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new InvalidEntityException(
                    "Erreur lors de la récupération des inscriptions",
                    e,
                    ErrorCodes.INSCRIPTION_FETCH_ERROR);
        }
    }

    @Override
    public InscriptionDto getInscriptionById(Long id) {
        if (id == null) {
            log.error("L'ID de l'inscription est nul");
            throw new InvalidEntityException(
                    "L'ID de l'inscription ne peut pas être nul",
                    ErrorCodes.INSCRIPTION_NOT_VALID);
        }

        return inscriptionRepository.findById(id)
                .map(InscriptionDto::fromEntity)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Aucune inscription trouvée avec l'ID = " + id,
                        ErrorCodes.INSCRIPTION_NOT_FOUND));
    }

    @Override
    public InscriptionDto saveInscription(InscriptionDto dto) {
        if (dto == null) {
            throw new InvalidEntityException(
                    "Les données de l'inscription sont invalides",
                    ErrorCodes.INSCRIPTION_NOT_VALID);
        }

        try {
            // Récupération de la session associée
            Sessions session = sessionRepository.findById(dto.getSessionId().longValue())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Session avec l'ID " + dto.getSessionId() + " introuvable"));

            // Conversion DTO -> Entité
            Inscription inscription = InscriptionDto.toEntity(dto);

            // Association de la session à l'inscription
            inscription.setSession(session);

            // Sauvegarde
            Inscription saved = inscriptionRepository.save(inscription);

            return InscriptionDto.fromEntity(saved);

        } catch (Exception e) {
            throw new InvalidEntityException(
                    "Erreur lors de l'enregistrement de l'inscription",
                    e,
                    ErrorCodes.INSCRIPTION_SAVE_ERROR);
        }
    }

    @Override
    public InscriptionDto updateInscription(Long id, InscriptionDto dto) {
        if (dto == null || id == null) {
            throw new InvalidEntityException(
                    "Données invalides pour la mise à jour de l'inscription",
                    ErrorCodes.INSCRIPTION_NOT_VALID);
        }

        Inscription inscription = inscriptionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Inscription non trouvée avec ID = " + id,
                        ErrorCodes.INSCRIPTION_NOT_FOUND));

        // Mise à jour des champs nécessaires
        if (dto.getDateInscription() != null) {
            inscription.setDateInscription(dto.getDateInscription());
        }
        if (dto.getStatut() != null) {
            inscription.setStatut(dto.getStatut());
        }
        if (dto.getCertificatGenere() != null) {
            inscription.setCertificatGenere(dto.getCertificatGenere());
        }

        if (dto.getDateFin() != null) {
            inscription.setDateFin(dto.getDateFin());
        }

        try {
            Inscription updatedInscription = inscriptionRepository.save(inscription);
            return InscriptionDto.fromEntity(updatedInscription);
        } catch (Exception e) {
            throw new InvalidEntityException(
                    "Erreur lors de la mise à jour de l'inscription",
                    e,
                    ErrorCodes.INSCRIPTION_UPDATE_ERROR);
        }
    }

    @Override
    public void deleteInscription(Long id) {
        if (id == null) {
            throw new InvalidEntityException(
                    "L'ID de l'inscription ne peut pas être nul",
                    ErrorCodes.INSCRIPTION_NOT_VALID);
        }

        Inscription inscription = inscriptionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Aucune inscription trouvée avec ID = " + id,
                        ErrorCodes.INSCRIPTION_NOT_FOUND));

        try {
            inscriptionRepository.delete(inscription);
            log.info("Inscription avec ID {} a été supprimée", id);
        } catch (Exception e) {
            throw new InvalidEntityException(
                    "Erreur lors de la suppression de l'inscription",
                    e,
                    ErrorCodes.INSCRIPTION_DELETE_ERROR);
        }
    }

    @Override
    public List<InscriptionDto> findByStatut(String statut) {
        if (!StringUtils.hasText(statut)) {
            throw new InvalidEntityException(
                    "Le statut ne peut pas être vide ou nul",
                    ErrorCodes.INSCRIPTION_NOT_VALID);
        }

        return inscriptionRepository.findByStatut(statut).stream()
                .map(InscriptionDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<InscriptionDto> findInscriptionsNonGenerees() {
        // Utilisation de FALSE pour la propriété Boolean
        return inscriptionRepository.findByCertificatGenere(Boolean.FALSE).stream()
                .map(InscriptionDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional

    // Méthode pour mettre à jour certificatGenere à true
    public void transformCertificatToGenerate(Long id) {
        inscriptionRepository.transformCertificatToGenerate(id);
    }

    @Transactional

    // Méthode pour mettre à jour certificatGenere à true
    public void transformCertificatToNonGenerate(Long id) {
        inscriptionRepository.transformCertificatToNonGenerate(id);
    }

}
