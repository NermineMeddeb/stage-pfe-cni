package CNI.Crud.Services.ServicesImplementations;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import CNI.Crud.Dto.AvisDto;
import CNI.Crud.Dto.CertificatsDto;
import CNI.Crud.Exceptions.InvalidEntityException;
import CNI.Crud.Model.Avis;
import CNI.Crud.Model.Certificats;
import CNI.Crud.Model.Inscription;
import CNI.Crud.Model.Sessions;
import CNI.Crud.Model.Utilisateurs;
import CNI.Crud.Services.AvisServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import CNI.Crud.Repository.AvisRepository;
import CNI.Crud.Repository.SessionsRepository;
import CNI.Crud.Repository.UtilisateursRepository;

@Service
public class AvisServiceImpl implements AvisServices {

    private final AvisRepository avisRepository;
    private final SessionsRepository sessionsRepository;
    private final UtilisateursRepository utilisateursRepository;
    @Autowired
    public AvisServiceImpl(AvisRepository avisRepository,SessionsRepository sessionsRepository, UtilisateursRepository utilisateursRepository) {
        this.sessionsRepository = sessionsRepository;
        this.utilisateursRepository = utilisateursRepository;
        this.avisRepository = avisRepository;
    }

    @Override
public AvisDto save(AvisDto avisDto) {
    if (avisDto == null) {
        throw new InvalidEntityException("L'objet avisDto ne peut pas être null");
    }

    // Conversion DTO -> Entité
    Avis avis = AvisDto.toEntity(avisDto);
    if (avis == null) {
        throw new InvalidEntityException("Impossible de convertir le DTO en entité Avis");
    }

    // Lier la session
    Long sessionId = avisDto.getSessionsId();
    if (sessionId == null) {
        throw new InvalidEntityException("L'ID de la session est obligatoire");
    }

    Sessions session = sessionsRepository.findById(sessionId)
        .orElseThrow(() -> new InvalidEntityException("Session non trouvée avec l'ID: " + sessionId));
    avis.setSessions(session);

    // Lier l'utilisateur (optionnel mais recommandé)
    Long utilisateurId = avisDto.getUtilisateursId();
    if (utilisateurId != null) {
        Utilisateurs utilisateur = utilisateursRepository.findById(utilisateurId.intValue())
            .orElseThrow(() -> new InvalidEntityException("Utilisateur non trouvé avec l'ID: " + utilisateurId));
        avis.setUtilisateurs(utilisateur);
    }

    // Sauvegarde
    Avis savedAvis = avisRepository.save(avis);
    return AvisDto.fromEntity(savedAvis);
}

    @Override
    public AvisDto findById(Long id) { // Le type ID devrait être Long
        Optional<Avis> avis = avisRepository.findById(id); // Recherche dans la base
        return avis.map(AvisDto::fromEntity)
                .orElseThrow(() -> new RuntimeException("Avis not found with id: " + id)); // Gérer l'exception si non
                                                                                           // trouvé
    }

    @Override
    public List<AvisDto> findAll() {
        return avisRepository.findAll().stream()
                .map(AvisDto::fromEntity) // Convertir chaque entité en DTO
                .collect(Collectors.toList()); // Retourner la liste des DTOs
    }

    @Override
    public void delete(Long id) { // Le type ID devrait être Long
        avisRepository.deleteById(id); // Suppression de l'avis par ID
    }
}
