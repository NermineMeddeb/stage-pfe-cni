package CNI.Crud.Services;

import java.util.List;

import org.springframework.stereotype.Service;

import CNI.Crud.Dto.CertificatsDto;

@Service
public interface CertificatsServices {
    CertificatsDto genererCertificat(CertificatsDto CertificatsDto);

    CertificatsDto getCertificatById(Integer idUtilisateur);

    CertificatsDto getCertificatByNumeroDeSerie(String numeroSerie);

    List<CertificatsDto> getAllCertificats();

    void supprimerCertificat(Integer idUtilisateur);

    void supprimerCertificatByNumeroDeSerie(String numeroSerie);

    List<CertificatsDto> getCertificatsByUserId(Long utilisateurId);

    void updateCertificatStatus(Long idCertificat, String nouveauStatut);

}
