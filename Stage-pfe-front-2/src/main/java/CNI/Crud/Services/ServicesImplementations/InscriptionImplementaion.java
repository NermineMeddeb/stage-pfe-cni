package CNI.Crud.Services.ServicesImplementations;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import CNI.Crud.Dto.InscriptionDto;
import CNI.Crud.Model.Inscription;
import CNI.Crud.Repository.InscriptionRepository;
import CNI.Crud.Services.FormationsServices;
import CNI.Crud.Services.InscriptionServices;
@Service
public class InscriptionImplementaion implements InscriptionServices {

    private final InscriptionRepository inscriptionRepository;

    @Autowired
    public InscriptionImplementaion(InscriptionRepository inscriptionRepository) {
        this.inscriptionRepository = inscriptionRepository;
    }

   

    @Override
    public List<InscriptionDto> findAll() {
        return inscriptionRepository.findAll().stream()
                .map(inscription -> new InscriptionDto(inscription.getId(), null, inscription.getDateInscription(),
                        inscription.getStatut(), inscription.getCertificatGenere(),
                        inscription.getDatedebut(), inscription.getDateFin()))
                .collect(Collectors.toList());
    }

   

}
