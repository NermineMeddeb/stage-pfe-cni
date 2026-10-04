package CNI.Crud.Services.ServicesImplementations;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import CNI.Crud.Dto.SessionsDto;
import CNI.Crud.Exceptions.EntityNotFoundException;
import CNI.Crud.Exceptions.ErrorCodes;
import CNI.Crud.Exceptions.InvalidEntityException;
import CNI.Crud.Model.Formations;
import CNI.Crud.Model.Inscription;
import CNI.Crud.Model.Role;
import CNI.Crud.Model.Salles;
import CNI.Crud.Model.Sessions;
import CNI.Crud.Model.Utilisateurs;
import CNI.Crud.Repository.AvisRepository;
import CNI.Crud.Repository.CertificatsRepository;
import CNI.Crud.Repository.FormationsRepository;
import CNI.Crud.Repository.InscriptionRepository;
import CNI.Crud.Repository.PaiementsRepository;
import CNI.Crud.Repository.SessionsRepository;
import CNI.Crud.Repository.ThemesRepository;
import CNI.Crud.Repository.UtilisateursRepository;
import CNI.Crud.Repository.SallesRepository;
import CNI.Crud.Services.SessionsServices;
import CNI.Crud.Validateur.SesssionsValidateur;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional
public class SessionsImplementation implements SessionsServices {
        @Override
        public List<Utilisateurs> getParticipants(Long sessionId) {
                Sessions session = sessionsRepository.findById(sessionId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Session non trouvée avec l'ID " + sessionId,
                                                ErrorCodes.SESSION_NOT_FOUND));
                return session.getUtilisateurs();
        }

        private final FormationsRepository formationsRepository;
        private final ThemesRepository themesRepository;
        private final SessionsRepository sessionsRepository;
        private final InscriptionRepository inscriptionsRepository;
        private final PaiementsRepository paiementsRepository;
        private final CertificatsRepository certificatsRepository;
        private final SallesRepository sallesRepository;
        private final UtilisateursRepository utilisateursRepository;
        private final InscriptionRepository inscriptionRepository;
        private final AvisRepository avisRepository;
        @Autowired
        public SessionsImplementation(
                        FormationsRepository formationsRepository, ThemesRepository themesRepository,
                        SessionsRepository sessionsRepository, InscriptionRepository inscriptionsRepository,
                        PaiementsRepository paiementsRepository, CertificatsRepository certificatsRepository,
                        SallesRepository sallesRepository, InscriptionRepository inscriptionRepository,
                        UtilisateursRepository utilisateursRepository,AvisRepository avisRepository) {
                this.inscriptionRepository = inscriptionRepository;
                this.utilisateursRepository = utilisateursRepository;
                this.certificatsRepository = certificatsRepository;
                this.sessionsRepository = sessionsRepository;
                this.formationsRepository = formationsRepository;
                this.themesRepository = themesRepository;
                this.inscriptionsRepository = inscriptionsRepository;
                this.paiementsRepository = paiementsRepository;
                this.sallesRepository = sallesRepository;
                this.avisRepository = avisRepository;


        }

        @Override
        public SessionsDto save(SessionsDto dto) {
                List<String> errors = SesssionsValidateur.validate(dto);
                if (!errors.isEmpty()) {
                        log.error("SessionsDto is not valid: {}", dto);
                        throw new InvalidEntityException("La session n'est pas valide",
                                        ErrorCodes.SESSION_NOT_VALID, errors);
                }

                try {
                        Formations formation = formationsRepository.findById(dto.getFormationId())
                                        .orElseThrow(() -> new EntityNotFoundException("Formation non trouvée",
                                                        ErrorCodes.FORMATION_NOT_FOUND));

                        List<Utilisateurs> utilisateurs = dto.getUtilisateursIds().stream()
                                        .map(id -> utilisateursRepository.findById(id)
                                                        .orElseThrow(() -> new EntityNotFoundException(
                                                                        "Utilisateur non trouvé avec l'ID " + id,
                                                                        ErrorCodes.UTILISATEUR_NOT_FOUND)))
                                        .collect(Collectors.toList());

                        Salles salle = sallesRepository.findById(dto.getSalleId())
                                        .orElseThrow(() -> new EntityNotFoundException("Salle non trouvée",
                                                        ErrorCodes.SALLE_NOT_FOUND));
                        Sessions session = SessionsDto.toEntity(dto, formation, utilisateurs, salle);
                        session = sessionsRepository.save(session);
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

        @Override
        public List<SessionsDto> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate) {
                return sessionsRepository.findByDateDebutBetween(startDate, endDate).stream()
                                .map(SessionsDto::fromEntity)
                                .collect(Collectors.toList());
        }

        @Override
        public void delete(Long id) {
                if (!sessionsRepository.existsById(id)) {
                        throw new EntityNotFoundException("Aucune session trouvée avec l'ID = " + id,
                                        ErrorCodes.SESSION_NOT_FOUND);
                }

                // 1. Récupérer toutes les inscriptions liées à cette session
                List<Inscription> inscriptions = inscriptionRepository.findBySessionId(id.intValue());

                // 2. Supprimer les certificats liés à chaque inscription
                for (Inscription inscription : inscriptions) {
                        certificatsRepository.deleteAllByInscriptionId(inscription.getId());
                }

                // 3. Supprimer les inscriptions
                inscriptionRepository.deleteAll(inscriptions);
                paiementsRepository.deleteAllBySessionsId(id.intValue());
                // 4. Supprimer les avis liés à cette session
                avisRepository.deleteBySessions_Id(id);
                // 4. Supprimer la session
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
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Session non trouvée avec l'ID " + sessionId,
                                                ErrorCodes.SESSION_NOT_FOUND));
        }

        public List<Sessions> getSessionsByMonth(int year, int month) {
                LocalDate debut = LocalDate.of(year, month, 1);
                LocalDate fin = debut.withDayOfMonth(debut.lengthOfMonth());
                return sessionsRepository.findByDateDebutBetween(debut.atStartOfDay(), fin.atTime(23, 59, 59));
        }

        @Override
        public SessionsDto updatesessions(SessionsDto dto) {
                if (dto == null || dto.getSessionId() == null) {
                        throw new InvalidEntityException("Les données de la session sont invalides",
                                        ErrorCodes.SESSION_NOT_VALID, List.of("Session ID est requis"));
                }

                Sessions existingSession = sessionsRepository.findById(dto.getSessionId().longValue())
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Session non trouvée avec ID : " + dto.getSessionId(),
                                                ErrorCodes.SESSION_NOT_FOUND));

                if (dto.getFormationId() != null) {
                        Formations formation = formationsRepository.findById(dto.getFormationId())
                                        .orElseThrow(() -> new EntityNotFoundException("Formation non trouvée",
                                                        ErrorCodes.FORMATION_NOT_FOUND));
                        existingSession.setFormation(formation);
                }

                if (dto.getUtilisateursIds() != null && !dto.getUtilisateursIds().isEmpty()) {
                        List<Utilisateurs> utilisateurs = dto.getUtilisateursIds().stream()
                                        .map(id -> utilisateursRepository.findById(id)
                                                        .orElseThrow(() -> new EntityNotFoundException(
                                                                        "Utilisateur non trouvé avec l'ID " + id,
                                                                        ErrorCodes.UTILISATEUR_NOT_FOUND)))
                                        .collect(Collectors.toList());
                        existingSession.setUtilisateurs(utilisateurs);
                }

                if (dto.getSalleId() != null) {
                        Salles salle = sallesRepository.findById(dto.getSalleId())
                                        .orElseThrow(() -> new EntityNotFoundException("Salle non trouvée",
                                                        ErrorCodes.SALLE_NOT_FOUND));
                        existingSession.setSalle(salle);
                }

                if (dto.getDateDebut() != null) {
                        existingSession.setDateDebut(dto.getDateDebut());
                }

                if (dto.getDateFin() != null) {
                        existingSession.setDateFin(dto.getDateFin());
                }

                if (dto.getCapacite() != null) {
                        existingSession.setCapacite(dto.getCapacite());
                }

                if (dto.getPlacesDisponibles() != null) {
                        existingSession.setPlacesDisponibles(dto.getPlacesDisponibles());
                }

                Sessions updatedSession = sessionsRepository.save(existingSession);
                return SessionsDto.fromEntity(updatedSession);
        }

        public int getNombreParticipants(Long sessionId) {
                Sessions session = sessionsRepository.findById(sessionId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Session introuvable avec l'ID : " + sessionId));

                return session.getCapacite() - session.getPlacesDisponibles();
        }

        @Override
        public List<Utilisateurs> getStudentParticipants(Long sessionId) {
                Sessions session = sessionsRepository.findById(sessionId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Session non trouvée avec l'ID " + sessionId,
                                                ErrorCodes.SESSION_NOT_FOUND));

                // Filtrer les utilisateurs avec le rôle "étudiant"
                return session.getUtilisateurs().stream()
                                .filter(utilisateur -> utilisateur.getRole() == Role.ETUDIANT)
                                .collect(Collectors.toList());
        }

        @Override
        public List<Utilisateurs> getFormateur(Long sessionId) {
                // Récupérer la session via son ID, ou lancer une exception si la session n'est
                // pas trouvée
                Sessions session = sessionsRepository.findById(sessionId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Session non trouvée avec l'ID " + sessionId,
                                                ErrorCodes.SESSION_NOT_FOUND));
                // Filtrer les utilisateurs ayant le rôle "EXTERNE" ou "INTERNE"
                return session.getUtilisateurs().stream()
                                .filter(utilisateur -> utilisateur.getRole() == Role.EXTERNE
                                                || utilisateur.getRole() == Role.INTERNE)
                                .collect(Collectors.toList());
        }

        public List<SessionsDto> findSessionsByFormateur(Long formateurId) {
                // Récupérer toutes les sessions
                List<Sessions> sessions = sessionsRepository.findAll();
                // System.out.println("Nombre total de sessions : " + sessions.size()); // Log
                // pour vérifier si des
                // sessions
                // existent

                // Filtrer les sessions où un des utilisateurs a le rôle de formateur (EXTERNE
                // ou INTERNE)
                List<Sessions> sessionsParFormateur = sessions.stream()
                                .filter(session -> {
                                        boolean hasFormateur = session.getUtilisateurs().stream()
                                                        .peek(utilisateur -> System.out
                                                                        .println("Vérification utilisateur ID: "
                                                                                        + utilisateur.getId()
                                                                                        + " Role: "
                                                                                        + utilisateur.getRole()))
                                                        .anyMatch(utilisateur -> {
                                                                /*
                                                                 * System.out.println("Comparaison de ID: "
                                                                 * + utilisateur.getId()
                                                                 * + " avec formateurId: "
                                                                 * + formateurId);
                                                                 */
                                                                return utilisateur.getId().equals(formateurId) &&
                                                                                (utilisateur.getRole() == Role.EXTERNE
                                                                                                || utilisateur.getRole() == Role.INTERNE);
                                                        });
                                        // System.out.println("Session ID : " + session.getId() + ", Formateur trouvé :
                                        // " + hasFormateur);
                                        return hasFormateur;
                                })
                                .collect(Collectors.toList());

                // Vérifier si des sessions ont été trouvées
                // System.out.println("Nombre de sessions trouvées pour le formateur " +
                // formateurId + " : "+ sessionsParFormateur.size());

                // Convertir les entités en DTO et renvoyer la liste
                return sessionsParFormateur.stream()
                                .map(SessionsDto::fromEntity)
                                .collect(Collectors.toList());
        }

        public List<SessionsDto> findAvailableSessionsByFormationId(Long formationId) {
                LocalDate today = LocalDate.now();
                List<Sessions> sessions = sessionsRepository.findAvailableSessionsByFormationId(formationId);

                System.out.println("Nombre de sessions récupérées = " + sessions.size());

                return sessions.stream()
                                .filter(session -> {
                                        boolean placesOk = session.getPlacesDisponibles() > 0;
                                        boolean dateOk = session.getDateDebut() != null
                                                        && !session.getDateDebut().isBefore(today.atStartOfDay());
                                        System.out.println("Session " + session.getId() + " => placesOk: " + placesOk
                                                        + ", dateOk: " + dateOk);
                                        return placesOk && dateOk;
                                })
                                .map(SessionsDto::fromEntity)
                                .collect(Collectors.toList());
        }

        @Transactional
        public SessionsDto addUserToSession(Long sessionId, Long utilisateurId) {
                // Récupérer la session
                Sessions session = sessionsRepository.findById(sessionId)
                                .orElseThrow(() -> new RuntimeException("Session not found"));

                // Récupérer l'utilisateur
                Utilisateurs utilisateur = utilisateursRepository.findById(utilisateurId.intValue())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // Ajouter l'utilisateur à la session
                session.getUtilisateurs().add(utilisateur);

                // Sauvegarder la session mise à jour
                Sessions updatedSession = sessionsRepository.save(session);

                // Convertir la session en DTO et retourner
                return SessionsDto.fromEntity(updatedSession);
        }
}
