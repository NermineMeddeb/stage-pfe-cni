package CNI.Crud.Services.ServicesImplementations;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import CNI.Crud.Dto.FormationsDto;
import CNI.Crud.Dto.SallesDto;
import CNI.Crud.Exceptions.EntityNotFoundException;
import CNI.Crud.Exceptions.ErrorCodes;
import CNI.Crud.Exceptions.InvalidEntityException;
import CNI.Crud.Model.*;
import CNI.Crud.Repository.AvisRepository;
import CNI.Crud.Repository.CertificatsRepository;
import CNI.Crud.Repository.FormationsRepository;
import CNI.Crud.Repository.InscriptionRepository;
import CNI.Crud.Repository.PaiementsRepository;
import CNI.Crud.Repository.SallesRepository;
import CNI.Crud.Repository.SessionsRepository;
import CNI.Crud.Repository.ThemesRepository;
import CNI.Crud.Repository.UtilisateursRepository;
import CNI.Crud.Services.SallesServices;
import jakarta.transaction.Transactional;

@Service
public class SallesImplementaion implements SallesServices {

    private final SallesRepository sallesRepository;
    private final SessionsRepository sessionsRepository;
    private final InscriptionRepository inscriptionsRepository;
    private final PaiementsRepository paiementsRepository;
    private final CertificatsRepository certificatsRepository;
    private final UtilisateursRepository utilisateursRepository;
    private final InscriptionRepository inscriptionRepository;
    private final AvisRepository avisRepository;

    public SallesImplementaion(
            SessionsRepository sessionsRepository,
            InscriptionRepository inscriptionsRepository,
            PaiementsRepository paiementsRepository,
            CertificatsRepository certificatsRepository,
            SallesRepository sallesRepository,
            InscriptionRepository inscriptionRepository,
            UtilisateursRepository utilisateursRepository,
            AvisRepository avisRepository) {
        this.inscriptionRepository = inscriptionRepository;
        this.utilisateursRepository = utilisateursRepository;
        this.certificatsRepository = certificatsRepository;
        this.sessionsRepository = sessionsRepository;
        this.inscriptionsRepository = inscriptionsRepository;
        this.paiementsRepository = paiementsRepository;
        this.sallesRepository = sallesRepository;
        this.avisRepository = avisRepository;

    }

    @Override
    public List<SallesDto> getAllSalles() {
        try {
            return sallesRepository.findAll().stream()
                    .map(SallesDto::fromEntity)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new InvalidEntityException(
                    "Error while fetching salles",
                    e,
                    ErrorCodes.SALLE_NOT_FOUND);
        }
    }

    @Override
    public SallesDto save(SallesDto dto) {
        Salles salle = sallesRepository.save(SallesDto.toEntity(dto));
        return SallesDto.fromEntity(salle);
    }

    @Override
    public SallesDto findById(Integer id) {
        return sallesRepository.findById(id)
                .map(SallesDto::fromEntity)
                .orElse(null);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        Long salleId = id.longValue();

        // 1. Récupérer les sessions associées à cette salle
        List<Sessions> sessions = sessionsRepository.findBySalleId(salleId);

        for (Sessions session : sessions) {
            int sessionId = session.getId().intValue();

            // 2. Supprimer les avis liés à cette session
            avisRepository.deleteAllBySessions(session);

            // 3. Supprimer les paiements liés à cette session
            paiementsRepository.deleteAllBySessionsId(sessionId);

            // 4. Récupérer et supprimer les certificats liés aux inscriptions
            List<Inscription> inscriptions = inscriptionRepository.findBySession(session);
            for (Inscription inscription : inscriptions) {
                certificatsRepository.deleteByInscription(inscription);
            }

            // 5. Supprimer les inscriptions
            inscriptionRepository.deleteAll(inscriptions);
        }

        // 6. Supprimer les sessions
        sessionsRepository.deleteAll(sessions);

        // 7. Supprimer la salle
        sallesRepository.deleteById(salleId);
    }

    @Override
    public SallesDto updateSalle(SallesDto dto) {
        if (dto == null || dto.getId() == null) {
            throw new InvalidEntityException("Les données de la SallesDto sont invalides",
                    ErrorCodes.SALLE_NOT_VALID, List.of("SallesDto ID est requis"));
        }

        // Vérifier si la formation existe
        Salles existingFormation = sallesRepository.findById(dto.getId())
                .orElseThrow(() -> new EntityNotFoundException("Formation non trouvée avec ID : " + dto.getId(),
                        ErrorCodes.FORMATION_NOT_FOUND));

        // Mise à jour des champs de la formation
        if (dto.getId() != null) {
            existingFormation.setId(dto.getId());
        }
        if (dto.getNom() != null) {
            existingFormation.setNom(dto.getNom());
        }
        if (dto.getCapacite() != null) {
            existingFormation.setCapacite(dto.getCapacite());
        }
        if (dto.getEquipement() != null) {
            existingFormation.setEquipement(dto.getEquipement());
        }

        // Sauvegarde de la formation mise à jour
        Salles updatedFormation = sallesRepository.save(existingFormation);

        return SallesDto.fromEntity(updatedFormation);
    }
}