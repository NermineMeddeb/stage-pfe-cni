package CNI.Crud.Controller;

import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import CNI.Crud.Controller.Api.CertificatsApi;
import CNI.Crud.Dto.CertificatsDto;
import CNI.Crud.Services.CertificatsServices;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class CertificatsController implements CertificatsApi {

    private final CertificatsServices certificatsServices;

    public CertificatsController(CertificatsServices certificatsServices) {
        this.certificatsServices = certificatsServices;
    }

    @Override
    public CertificatsDto genererCertificat(@RequestBody CertificatsDto certificatsDto) {
        return certificatsServices.genererCertificat(certificatsDto);
    }

    @Override
    public CertificatsDto getCertificatById(@PathVariable("idUtilisateur") Long idUtilisateur) {
        return certificatsServices.getCertificatById(idUtilisateur.intValue());
    }

    @Override
    public List<CertificatsDto> getAllCertificats() {
        return certificatsServices.getAllCertificats();
    }

    @Override
    public void supprimerCertificat(@PathVariable("idUtilisateur") Long idUtilisateur) {
        certificatsServices.supprimerCertificat(idUtilisateur.intValue());
    }

    @Override
    public CertificatsDto getCertificatByNumeroDeSerie(@PathVariable String numeroSerie) {
        return certificatsServices.getCertificatByNumeroDeSerie(numeroSerie);
    }

    @Override
    public void supprimerCertificatByNumeroDeSerie(@PathVariable String numeroSerie) {
        certificatsServices.supprimerCertificatByNumeroDeSerie(numeroSerie);
    }

    @Override
    public List<CertificatsDto> getCertificatsByUserId(@PathVariable Long utilisateurId) {
        return certificatsServices.getCertificatsByUserId(utilisateurId);
    }

    @Override
    public void updateCertificatStatus(@PathVariable Long idCertificat, @PathVariable String nouveauStatut) {
        certificatsServices.updateCertificatStatus(idCertificat, nouveauStatut);
    }
}
