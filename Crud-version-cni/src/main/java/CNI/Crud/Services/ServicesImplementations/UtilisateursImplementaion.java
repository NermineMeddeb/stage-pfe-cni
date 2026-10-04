package CNI.Crud.Services.ServicesImplementations;

import java.util.Arrays;
import java.util.Collections;
import org.springframework.util.StringUtils;
import CNI.Crud.Dto.ChangerMotDePasseUtilisateurDto;
import CNI.Crud.Dto.UtilisateursDto;
import CNI.Crud.Exceptions.EntityNotFoundException;
import CNI.Crud.Exceptions.ErrorCodes;
import CNI.Crud.Exceptions.InvalidEntityException;
import CNI.Crud.Exceptions.InvalidOperation;
import CNI.Crud.Model.Utilisateurs;
import CNI.Crud.Repository.AvisRepository;
import CNI.Crud.Repository.InscriptionRepository;
import CNI.Crud.Repository.NotificationsRepository;
import CNI.Crud.Repository.UtilisateursRepository;
import CNI.Crud.Validateur.UtilisateursValidateur;
import org.springframework.transaction.annotation.Transactional;
import CNI.Crud.Services.UtilisateursServices;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UtilisateursImplementaion implements UtilisateursServices {
    private UtilisateursRepository utilisateurRepository;
    private final AvisRepository avisRepository;
    private final InscriptionRepository inscriptionRepository;
    private final NotificationsRepository notificationRepository;

    @Autowired
    public UtilisateursImplementaion(UtilisateursRepository utilisateurRepository, AvisRepository avisRepository,
            InscriptionRepository inscriptionRepository, NotificationsRepository notificationRepository) {
        this.avisRepository = avisRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.inscriptionRepository = inscriptionRepository;
        this.notificationRepository = notificationRepository;
    }

    @Override
    public UtilisateursDto save(UtilisateursDto dto) {
        List<String> errors = UtilisateursValidateur.validate(dto);
        if (!errors.isEmpty()) {
            log.error("Utilisateur is not valid {}", dto);
            throw new InvalidEntityException("L'utilisateur n'est pas valide", ErrorCodes.UTILISATEUR_NOT_VALID,
                    errors);
        }

        if (userAlreadyExists(dto.getEmail())) {
            throw new InvalidEntityException("Un autre utilisateur avec le même email existe déjà",
                    ErrorCodes.UTILISATEUR_ALREADY_EXISTS,
                    Collections.singletonList("Un autre utilisateur avec le même email existe déjà dans la BDD"));
        }

        dto.setMotDePasse((dto.getMotDePasse()));

        return UtilisateursDto.fromEntity(utilisateurRepository.save(UtilisateursDto.toEntity(dto)));
    }

    @Override
    @Transactional
    public UtilisateursDto updateUtilisateurs(UtilisateursDto dto) {
        if (dto == null || dto.getId() == null) {
            throw new InvalidEntityException("Les données de l'utilisateur sont invalides",
                    ErrorCodes.UTILISATEUR_NOT_VALID, List.of("ID utilisateur requis"));
        }

        Utilisateurs existingUser = utilisateurRepository.findById(dto.getId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Aucun utilisateur trouvé avec l'ID : " + dto.getId(),
                        ErrorCodes.UTILISATEUR_NOT_FOUND));

        if (dto.getNom() != null) {
            existingUser.setNom(dto.getNom());
        }
        if (dto.getPrenom() != null) {
            existingUser.setPrenom(dto.getPrenom());
        }
        if (dto.getEmail() != null) {
            if (!existingUser.getEmail().equals(dto.getEmail()) && userAlreadyExists(dto.getEmail())) {
                throw new InvalidEntityException("Un autre utilisateur avec le même email existe déjà",
                        ErrorCodes.UTILISATEUR_ALREADY_EXISTS,
                        Collections.singletonList("Un autre utilisateur avec le même email existe déjà dans la BDD"));
            }
            existingUser.setEmail(dto.getEmail());
        }
        if (dto.getMotDePasse() != null) {
            existingUser.setMotDePasse(dto.getMotDePasse());
        }

        if (dto.getTelephone() != null) {
            existingUser.setTelephone(dto.getTelephone());
        }
        if (dto.getRole() != null) {
            existingUser.setRole(dto.getRole());
        }

        Utilisateurs updatedUser = utilisateurRepository.save(existingUser);
        return UtilisateursDto.fromEntity(updatedUser);
    }

    private boolean userAlreadyExists(String email) {
        Optional<Utilisateurs> user = utilisateurRepository.findUtilisateurByEmail(email);
        return user.isPresent();
    }

    @Override
    public UtilisateursDto findById(Integer id) {
        if (id == null) {
            log.error("Utilisateur ID is null");
            return null;
        }
        return utilisateurRepository.findById(id)
                .map(UtilisateursDto::fromEntity)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Aucun utilisateur avec l'ID = " + id + " n'a été trouvé dans la BDD",
                        ErrorCodes.UTILISATEUR_NOT_FOUND));
    }

    @Override
    public List<UtilisateursDto> findAll() {
        return utilisateurRepository.findAll().stream()
                .map(UtilisateursDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        if (id == null) {
            log.error("Utilisateur ID is null");
            return;
        }

        // Supprimer la liaison formateur <-> avis (table avis_formateurs)
        avisRepository.deleteFormateurFromAvisFormateurs(id.longValue());

        // Supprimer les sessions associées
        utilisateurRepository.deleteRelatedSessions(id);

        // Supprimer les paiements
        utilisateurRepository.deleteRelatedPaiements(id);

        // Supprimer les avis
        avisRepository.deleteByUtilisateurs_Id(id.longValue());

        // Supprimer les inscriptions
        inscriptionRepository.deleteByUtilisateur_Id(id.longValue());

        // Supprimer les notifications
        notificationRepository.deleteByUtilisateurId(id.longValue());

        // Supprimer l'utilisateur
        utilisateurRepository.deleteById(id);
    }

    @Override
    public UtilisateursDto findByEmail(String email) {
        return utilisateurRepository.findUtilisateurByEmail(email)
                .map(UtilisateursDto::fromEntity)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Aucun utilisateur avec l'email = " + email + " n'a été trouvé dans la BDD",
                        ErrorCodes.UTILISATEUR_NOT_FOUND));
    }

    @Override
    public UtilisateursDto changerMotDePasse(ChangerMotDePasseUtilisateurDto dto) {
        validate(dto);
        Optional<Utilisateurs> utilisateurOptional = utilisateurRepository.findById(dto.getId());
        if (utilisateurOptional.isEmpty()) {
            log.warn("Aucun utilisateur n'a été trouvé avec l'ID " + dto.getId());
            throw new EntityNotFoundException("Aucun utilisateur n'a été trouvé avec l'ID " + dto.getId(),
                    ErrorCodes.UTILISATEUR_NOT_FOUND);
        }

        Utilisateurs utilisateur = utilisateurOptional.get();
        utilisateur.setMotDePasse((dto.getMotDePasse()));

        return UtilisateursDto.fromEntity(utilisateurRepository.save(utilisateur));
    }

    private void validate(ChangerMotDePasseUtilisateurDto dto) {
        if (dto == null) {
            log.warn("Impossible de modifier le mot de passe avec un objet NULL");
            throw new InvalidOperation("Aucune information n'a été fournie pour pouvoir changer le mot de passe",
                    ErrorCodes.UTILISATEUR_CHANGE_PASSWORD_OBJECT_NOT_VALID);
        }
        if (dto.getId() == null) {
            log.warn("Impossible de modifier le mot de passe avec un ID NULL");
            throw new InvalidOperation("ID utilisateur null:: Impossible de modifier le mot de passe",
                    ErrorCodes.UTILISATEUR_CHANGE_PASSWORD_OBJECT_NOT_VALID);
        }
        if (!StringUtils.hasLength(dto.getMotDePasse()) || !StringUtils.hasLength(dto.getConfirmMotDePasse())) {
            log.warn("Impossible de modifier le mot de passe avec un mot de passe NULL");
            throw new InvalidOperation("Mot de passe utilisateur null:: Impossible de modifier le mot de passe",
                    ErrorCodes.UTILISATEUR_CHANGE_PASSWORD_OBJECT_NOT_VALID);
        }
        if (!dto.getMotDePasse().equals(dto.getConfirmMotDePasse())) {
            log.warn("Impossible de modifier le mot de passe avec deux mots de passe différents");
            throw new InvalidOperation(
                    "Mots de passe utilisateur non conformes:: Impossible de modifier le mot de passe",
                    ErrorCodes.UTILISATEUR_CHANGE_PASSWORD_OBJECT_NOT_VALID);
        }
    }

    @Override
    public List<UtilisateursDto> findEtudiants() {
        return utilisateurRepository.findByRoleNames(List.of("ETUDIANT"))
                .stream()
                .map(UtilisateursDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<UtilisateursDto> findFormateur() {
        return utilisateurRepository.findByRoleNames(List.of("EXTERNE", "INTERNE"))
                .stream()
                .map(UtilisateursDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<UtilisateursDto> findAdministrateurs() {
        return utilisateurRepository.findByRoleNames(List.of("ADMIN"))

                .stream()
                .map(UtilisateursDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<UtilisateursDto> findFormateurinterne() {
        return utilisateurRepository.findByRoleNames(List.of("INTERNE"))
                .stream()
                .map(UtilisateursDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<UtilisateursDto> findFormateurexterne() {
        return utilisateurRepository.findByRoleNames(List.of("EXTERNE"))
                .stream()
                .map(UtilisateursDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<UtilisateursDto> findPersonnel_CNI() {
        return utilisateurRepository.findByRoleNames(List.of("EMPLOYEE"))

                .stream()
                .map(UtilisateursDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UtilisateursDto getUtilisateurByInscriptionId(Long inscriptionId) {
        Utilisateurs utilisateur = utilisateurRepository.findUtilisateurByInscriptionId(inscriptionId);

        if (utilisateur == null) {
            throw new EntityNotFoundException("Aucun utilisateur trouvé pour l'inscription ID " + inscriptionId);
        }

        return UtilisateursDto.fromEntity(utilisateur);
    }
}
