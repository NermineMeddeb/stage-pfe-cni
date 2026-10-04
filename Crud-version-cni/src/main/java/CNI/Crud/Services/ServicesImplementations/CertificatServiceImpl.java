package CNI.Crud.Services.ServicesImplementations;

import CNI.Crud.Dto.CertificatsDto;
import CNI.Crud.Exceptions.EntityNotFoundException;
import CNI.Crud.Exceptions.InvalidEntityException;
import CNI.Crud.Model.Certificats;
import CNI.Crud.Model.Inscription;
import CNI.Crud.Repository.CertificatsRepository;
import CNI.Crud.Repository.InscriptionRepository;
import CNI.Crud.Services.CertificatsServices;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;


@Service
public class CertificatServiceImpl implements CertificatsServices {

    private final CertificatsRepository certificatRepository;
    private final InscriptionRepository inscriptionRepository;

    @Autowired
    public CertificatServiceImpl(CertificatsRepository certificatRepository,
            InscriptionRepository inscriptionRepository) {
        this.certificatRepository = certificatRepository;
        this.inscriptionRepository = inscriptionRepository;

    }

    @Override
    public CertificatsDto genererCertificat(CertificatsDto certificatsDto) {
        try {
            if (certificatsDto == null) {
                throw new InvalidEntityException("Le certificat DTO ne peut pas être null");
            }

            // Conversion DTO -> Entité
            Certificats certificat = CertificatsDto.toEntity(certificatsDto);
            if (certificat == null) {
                throw new InvalidEntityException("Impossible de convertir le DTO en entité Certificats");
            }

            // Vérifier et lier l'inscription si nécessaire
            if (certificatsDto.getInscriptionId() != null) {
                Inscription inscription = inscriptionRepository.findById(certificatsDto.getInscriptionId())
                        .orElseThrow(() -> new InvalidEntityException(
                                "Inscription non trouvée avec ID: " + certificatsDto.getInscriptionId()));
                certificat.setInscription(inscription);
            } else {
                throw new InvalidEntityException("L'ID de l'inscription est obligatoire");
            }

            // Définir la date de génération si elle est absente
            if (certificat.getDateGeneration() == null) {
                certificat.setDateGeneration(LocalDate.now());
            }

            // Sauvegarde du certificat
            Certificats savedCertificat = certificatRepository.save(certificat);
            return CertificatsDto.fromEntity(savedCertificat);
        } catch (Exception e) {
            throw new InvalidEntityException("Erreur lors de la génération du certificat: " + e.getMessage(), e);
        }
    }

    @Override
    public CertificatsDto getCertificatById(Integer idUtilisateur) {
        // Changed to use findByInscriptionId instead of findByIdUtilisateur
        return certificatRepository.findByInscriptionId(idUtilisateur)
                .map(CertificatsDto::fromEntity)
                .orElseThrow(() -> new InvalidEntityException(
                        "Certificat non trouvé pour l'inscription avec ID: " + idUtilisateur));
    }

    @Override
    public List<CertificatsDto> getAllCertificats() {
        return certificatRepository.findAll().stream()
                .map(CertificatsDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public void supprimerCertificat(Integer idUtilisateur) {
        // Changed to use findByInscriptionId instead of findByIdUtilisateur
        Certificats certificat = certificatRepository.findByInscriptionId(idUtilisateur)
                .orElseThrow(() -> new InvalidEntityException(
                        "Certificat non trouvé pour l'inscription avec ID: " + idUtilisateur));
        certificatRepository.delete(certificat);
    }

    @Override
    public CertificatsDto getCertificatByNumeroDeSerie(String numeroSerie) {
        return certificatRepository.findByNumeroSerie(numeroSerie)
                .map(CertificatsDto::fromEntity) // Utilisation correcte de la conversion DTO
                .orElse(null);
    }

    @Override
    public void supprimerCertificatByNumeroDeSerie(String numeroSerie) {
        Certificats certificat = certificatRepository.findByNumeroSerie(numeroSerie)
                .orElseThrow(() -> new InvalidEntityException(
                        "Certificat non trouvé avec le numéro de série: " + numeroSerie));
        certificatRepository.delete(certificat);
    }

    @Transactional
public List<CertificatsDto> getCertificatsByUserId(Long utilisateurId) {
    // Récupérer toutes les inscriptions pour l'utilisateur
    List<Inscription> inscriptions = inscriptionRepository.findByUtilisateurId(utilisateurId);

    // Récupérer les IDs des inscriptions qui ont généré des certificats
    List<Long> inscriptionIds = inscriptions.stream()
            .filter(Inscription::getCertificatGenere) // Vérifier si un certificat a été généré
            .map(inscription -> inscription.getId().longValue()) // Convertir Integer en Long
            .collect(Collectors.toList());

    // Récupérer tous les certificats associés aux inscriptions filtrées en une seule requête
    List<Certificats> certificats = certificatRepository.findByInscriptionIds(inscriptionIds);

    // Convertir chaque certificat en CertificatDto
    return certificats.stream()
            .map(CertificatsDto::fromEntity)
            .collect(Collectors.toList());
}


    @Transactional
    @Override
    public void updateCertificatStatus(Long idCertificat, String nouveauStatut) {
        // Trouver le certificat par son ID
        Certificats certificat = certificatRepository.findById(idCertificat)
                .orElseThrow(() -> new EntityNotFoundException("Certificat non trouvé avec ID : " + idCertificat));

        // Modifier le statut
        certificat.setStatut(nouveauStatut);

        // Sauvegarder la mise à jour
        certificatRepository.save(certificat);
    }

}