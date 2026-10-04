package CNI.Crud.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import CNI.Crud.Controller.Api.InscriptionApi;
import CNI.Crud.Dto.InscriptionDto;
import CNI.Crud.Services.InscriptionServices;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/inscriptions")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Inscriptions", description = "API de gestion des inscriptions")
public class InscriptionController implements InscriptionApi {

    private final InscriptionServices inscriptionService;

    @Autowired
    public InscriptionController(InscriptionServices inscriptionService) {
        this.inscriptionService = inscriptionService;
    }

    @Override
    public List<InscriptionDto> findAll() {
        return inscriptionService.findAll();
    }

    @Override
    public InscriptionDto getInscriptionById(Long id) {
        return inscriptionService.getInscriptionById(id);
    }

    @Override
    public InscriptionDto saveInscription(InscriptionDto dto) {
        return inscriptionService.saveInscription(dto);
    }

    @Override
    public InscriptionDto updateInscription(Long id, InscriptionDto inscriptionDto) {
        return inscriptionService.updateInscription(id, inscriptionDto);
    }

    @Override
    public void deleteInscription(Long id) {
        inscriptionService.deleteInscription(id);
    }

    @Override
    public List<InscriptionDto> findByStatut(String statut) {
        return inscriptionService.findByStatut(statut);
    }

    @Override
    public List<InscriptionDto> getInscriptionsNonGenerees() {
        return inscriptionService.findInscriptionsNonGenerees();
    } // Web service pour mettre à jour certificatGenere à true

    public void transformCertificatToGenerate(Long id) {
        inscriptionService.transformCertificatToGenerate(id);
    }

    public void transformCertificatToNonGenerate(Long id) {
        inscriptionService.transformCertificatToNonGenerate(id);
    }
}