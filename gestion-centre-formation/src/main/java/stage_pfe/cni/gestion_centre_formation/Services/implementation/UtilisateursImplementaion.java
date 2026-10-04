package stage_pfe.cni.gestion_centre_formation.Services.implementation;
/* 
import java.util.Collections;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import stage_pfe.cni.gestion_centre_formation.Dto.UtilisateursDto;
import stage_pfe.cni.gestion_centre_formation.Exceptions.EntityNotFoundException;
import stage_pfe.cni.gestion_centre_formation.Exceptions.ErrorCodes;
import stage_pfe.cni.gestion_centre_formation.Exceptions.InvalidEntityException;
import stage_pfe.cni.gestion_centre_formation.Exceptions.InvalidOperation;
import stage_pfe.cni.gestion_centre_formation.Model.Utilisateurs;
import stage_pfe.cni.gestion_centre_formation.Repository.UtilisateursRepository;
import stage_pfe.cni.gestion_centre_formation.Validateur.UtilisateursValidateur;
import stage_pfe.cni.gestion_centre_formation.Services.UtilisateursServices;
import stage_pfe.cni.gestion_centre_formation.Dto.ChangerMotDePasseUtilisateurDto;

@Service
@Slf4j
public class UtilisateursImplementaion implements UtilisateursServices {
  private UtilisateursRepository utilisateurRepository;
  private PasswordEncoder passwordEncoder;

  @Autowired
  public UtilisateursImplementaion(UtilisateursRepository utilisateurRepository,
      PasswordEncoder passwordEncoder) {
    this.utilisateurRepository = utilisateurRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public UtilisateursDto save(UtilisateursDto dto) {
    List<String> errors = UtilisateursValidateur.validate(dto);
    if (!errors.isEmpty()) {
      log.error("Utilisateur is not valid {}", dto);
      throw new InvalidEntityException("L'utilisateur n'est pas valide", ErrorCodes.UTILISATEUR_NOT_VALID, errors);
    }

    if (userAlreadyExists(dto.getEmail())) {
      throw new InvalidEntityException("Un autre utilisateur avec le meme email existe deja",
          ErrorCodes.UTILISATEUR_ALREADY_EXISTS,
          Collections.singletonList("Un autre utilisateur avec le meme email existe deja dans la BDD"));
    }

    dto.setMotDePasse(passwordEncoder.encode(dto.getMotDePasse()));

    return UtilisateursDto.fromEntity(
        utilisateurRepository.save(
            UtilisateursDto.toEntity(dto)));
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
            "Aucun utilisateur avec l'ID = " + id + " n' ete trouve dans la BDD",
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
            "Aucun utilisateur avec l'email = " + email + " n' ete trouve dans la BDD",
            ErrorCodes.UTILISATEUR_NOT_FOUND));
  }

  @Override
  public UtilisateursDto changerMotDePasse(ChangerMotDePasseUtilisateurDto dto) {
    validate(dto);
    Optional<Utilisateurs> utilisateurOptional = utilisateurRepository.findById(dto.getId());
    if (utilisateurOptional.isEmpty()) {
      log.warn("Aucun utilisateur n'a ete trouve avec l'ID " + dto.getId());
      throw new EntityNotFoundException("Aucun utilisateur n'a ete trouve avec l'ID " + dto.getId(),
          ErrorCodes.UTILISATEUR_NOT_FOUND);
    }

    Utilisateurs utilisateur = utilisateurOptional.get();
    utilisateur.setMotDePasse(passwordEncoder.encode(dto.getMotDePasse()));

    return UtilisateursDto.fromEntity(
        utilisateurRepository.save(utilisateur));
  }

  private void validate(ChangerMotDePasseUtilisateurDto dto) {
    if (dto == null) {
      log.warn("Impossible de modifier le mot de passe avec un objet NULL");
      throw new InvalidOperation("Aucune information n'a ete fourni pour pouvoir changer le mot de passe",
          ErrorCodes.UTILISATEUR_CHANGE_PASSWORD_OBJECT_NOT_VALID);
    }
    if (dto.getId() == null) {
      log.warn("Impossible de modifier le mot de passe avec un ID NULL");
      throw new InvalidOperation("ID utilisateur null:: Impossible de modifier le mote de passe",
          ErrorCodes.UTILISATEUR_CHANGE_PASSWORD_OBJECT_NOT_VALID);
    }
    if (!StringUtils.hasLength(dto.getMotDePasse()) || !StringUtils.hasLength(dto.getConfirmMotDePasse())) {
      log.warn("Impossible de modifier le mot de passe avec un mot de passe NULL");
      throw new InvalidOperation("Mot de passe utilisateur null:: Impossible de modifier le mote de passe",
          ErrorCodes.UTILISATEUR_CHANGE_PASSWORD_OBJECT_NOT_VALID);
    }
    if (!dto.getMotDePasse().equals(dto.getConfirmMotDePasse())) {
      log.warn("Impossible de modifier le mot de passe avec deux mots de passe different");
      throw new InvalidOperation("Mots de passe utilisateur non conformes:: Impossible de modifier le mote de passe",
          ErrorCodes.UTILISATEUR_CHANGE_PASSWORD_OBJECT_NOT_VALID);
    }
  }
}
  */