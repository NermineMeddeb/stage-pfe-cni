package CNI.Crud.Services.ServicesImplementations;

import java.util.Collections;
import org.springframework.util.StringUtils;

import CNI.Crud.Dto.ChangerMotDePasseUtilisateurDto;
import CNI.Crud.Dto.UtilisateursDto;
import CNI.Crud.Exceptions.EntityNotFoundException;
import CNI.Crud.Exceptions.ErrorCodes;
import CNI.Crud.Exceptions.InvalidEntityException;
import CNI.Crud.Exceptions.InvalidOperation;
import CNI.Crud.Model.Utilisateurs;
import CNI.Crud.Repository.UtilisateursRepository;
import CNI.Crud.Validateur.UtilisateursValidateur;
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

    @Autowired
    public UtilisateursImplementaion(UtilisateursRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
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
    public void delete(Integer id) {
        if (id == null) {
            log.error("Utilisateur ID is null");
            return;
        }
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
        return utilisateurRepository.findByRole("ETUDIANT")
                .stream()
                .map(UtilisateursDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<UtilisateursDto> findFormateur() {
        return utilisateurRepository.findByRole("formateur")
                .stream()
                .map(UtilisateursDto::fromEntity)
                .collect(Collectors.toList());
    }
    @Override
    public List<UtilisateursDto> findAdministrateurs() {
        return utilisateurRepository.findByRole("admin")
                .stream()
                .map(UtilisateursDto::fromEntity)
                .collect(Collectors.toList());
    }
}
