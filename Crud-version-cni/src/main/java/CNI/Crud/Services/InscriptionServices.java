package CNI.Crud.Services;

import CNI.Crud.Dto.FormationsDto;
import CNI.Crud.Dto.InscriptionDto;
import CNI.Crud.Model.Inscription;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service

public interface InscriptionServices {
    List<InscriptionDto> findAll();

    InscriptionDto getInscriptionById(Long id);

    InscriptionDto saveInscription(InscriptionDto dto);

    InscriptionDto updateInscription(Long id, InscriptionDto inscriptionDto);

    void deleteInscription(Long id);

    List<InscriptionDto> findByStatut(String statut);

    List<InscriptionDto> findInscriptionsNonGenerees();

    // Méthode pour mettre à jour certificatGenere à true
    void transformCertificatToGenerate(Long id);
    void transformCertificatToNonGenerate(Long id);

}
