package stage_pfe.cni.gestion_centre_formation.Services.implementation;
/* 
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import stage_pfe.cni.gestion_centre_formation.Dto.SessionsDto;
import stage_pfe.cni.gestion_centre_formation.Exceptions.EntityNotFoundException;
import stage_pfe.cni.gestion_centre_formation.Exceptions.ErrorCodes;
import stage_pfe.cni.gestion_centre_formation.Exceptions.InvalidEntityException;
import stage_pfe.cni.gestion_centre_formation.Model.Formations;
import stage_pfe.cni.gestion_centre_formation.Model.Salles;
import stage_pfe.cni.gestion_centre_formation.Model.Sessions;
import stage_pfe.cni.gestion_centre_formation.Model.Utilisateurs;
import stage_pfe.cni.gestion_centre_formation.Repository.FormationsRepository;
import stage_pfe.cni.gestion_centre_formation.Repository.InscriptionRepository;
import stage_pfe.cni.gestion_centre_formation.Repository.SallesRepository;
import stage_pfe.cni.gestion_centre_formation.Repository.SessionsRepository;
import stage_pfe.cni.gestion_centre_formation.Repository.ThemesRepository;
import stage_pfe.cni.gestion_centre_formation.Repository.UtilisateursRepository;
import stage_pfe.cni.gestion_centre_formation.Services.SessionsServices;
import stage_pfe.cni.gestion_centre_formation.Validateur.SesssionsValidateur;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class SessionsImplementation implements SessionsServices {

    private final SessionsRepository sessionsRepository;
    private final FormationsRepository formationsRepository;
    private final SallesRepository  sallesRepository;
    private final UtilisateursRepository utilisateursRepository;

    @Override
    public SessionsDto save(SessionsDto dto) {
        List<String> errors = SesssionsValidateur.validate(dto);
        if (!errors.isEmpty()) {
            log.error("SessionsDto is not valid: {}", dto);
            throw new InvalidEntityException("La session n'est pas valide",
                    ErrorCodes.SESSION_NOT_VALID,
                    errors);
        }
    
        try {
            // Récupérer les entités associées depuis la base de données
            Formations formation = formationsRepository.findById(dto.getFormationId())
                    .orElseThrow(() -> new EntityNotFoundException("Formation non trouvée", ErrorCodes.FORMATION_NOT_FOUND));
    
            Utilisateurs utilisateur = utilisateursRepository.findById(dto.getUtilisateurId())
                    .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé", ErrorCodes.UTILISATEUR_NOT_FOUND));
    
            Salles salle = sallesRepository.findById(dto.getSalleId())
                    .orElseThrow(() -> new EntityNotFoundException("Salle non trouvée", ErrorCodes.SALLE_NOT_FOUND));
    
            // Convertir le DTO en entité
            Sessions session = SessionsDto.toEntity(dto, formation, utilisateur, salle);
    
            // Sauvegarder l'entité
            session = sessionsRepository.save(session);
    
            // Retourner le DTO correspondant
            return SessionsDto.fromEntity(session);
        } catch (EntityNotFoundException e) {
            log.error("Erreur lors de la récupération des entités associées: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Erreur lors de l'enregistrement de la session", e);
            throw new InvalidEntityException("Erreur lors de l'enregistrement de la session",
                    ErrorCodes.SESSION_SAVE_ERROR, List.of(e.getMessage()));
        }
    }
    
    @Override
    public SessionsDto findById(Long id) {
        return sessionsRepository.findById(id)
                .map(SessionsDto::fromEntity)
                .orElseThrow(() -> new EntityNotFoundException("No Session found with ID = " + id,
                        ErrorCodes.SESSION_NOT_FOUND));
    }

    @Override
    public List<SessionsDto> findAll() {
        return sessionsRepository.findAll().stream()
                .map(SessionsDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<SessionsDto> findByFormation(Long formationId) {
        return sessionsRepository.findByFormationId(formationId).stream()
                .map(SessionsDto::fromEntity)
                .collect(Collectors.toList());
    }
    /*
     * @Override
     * public List<SessionsDto> findByFormateur(Long formateurId) {
     * return sessionsRepository.findByUtilisateursId(formateurId).stream()
     * .map(SessionsDto::fromEntity)
     * .collect(Collectors.toList());
     * }
     */

   /*  @Override
    public List<SessionsDto> findByDateBetween(LocalDate startDate, LocalDate endDate) {
        return sessionsRepository.findByDateDebutBetween(startDate, endDate).stream()
                .map(SessionsDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Long id) {
        if (!sessionsRepository.existsById(id)) {
            throw new EntityNotFoundException("Aucune session trouvée avec l'ID = " + id, ErrorCodes.SESSION_NOT_FOUND);
        }
        sessionsRepository.deleteById(id);
    }

    @Override
    public List<SessionsDto> findUpcomingSessions() {
        return sessionsRepository.findUpcomingSessions().stream()
                .map(SessionsDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public Integer getAvailablePlaces(Long sessionId) {
        return sessionsRepository.findById(sessionId)
                .map(Sessions::getPlacesDisponibles)
                .orElseThrow(() -> new EntityNotFoundException("Session non trouvée avec l'ID " + sessionId,
                        ErrorCodes.SESSION_NOT_FOUND));
    }
}
 */