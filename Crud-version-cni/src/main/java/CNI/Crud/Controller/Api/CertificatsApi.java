package CNI.Crud.Controller.Api;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import CNI.Crud.Dto.CertificatsDto;
import io.swagger.v3.oas.annotations.Operation;

public interface CertificatsApi {

    @Operation(summary = "Générer un certificat", description = "Ce service permet de générer un certificat pour un utilisateur.")
    @PostMapping("/api/generer")
    CertificatsDto genererCertificat(@RequestBody CertificatsDto certificatsDto);

    @Operation(summary = "Obtenir un certificat par ID utilisateur", description = "Ce service permet de récupérer un certificat généré par ID utilisateur.")
    @GetMapping("/api/{idUtilisateur}")
    CertificatsDto getCertificatById(@PathVariable("idUtilisateur") Long idUtilisateur);

    @Operation(summary = "Obtenir tous les certificats", description = "Ce service permet de récupérer tous les certificats générés.")
    @GetMapping("/api/certificats/all")
    List<CertificatsDto> getAllCertificats();

    @Operation(summary = "Supprimer un certificat", description = "Ce service permet de supprimer un certificat généré pour un utilisateur.")
    @DeleteMapping("/api/{idUtilisateur}")
    void supprimerCertificat(@PathVariable("idUtilisateur") Long idUtilisateur);

    @GetMapping("/api/numero/{numeroSerie}")
    CertificatsDto getCertificatByNumeroDeSerie(@PathVariable String numeroSerie);

    @Operation(summary = "Supprimer un certificat par numéro de série", description = "Ce service permet de supprimer un certificat généré en fonction de son numéro de série.")
    @DeleteMapping("/api/supprimerCertificatByNumeroDeSerie/{numeroSerie}")
    void supprimerCertificatByNumeroDeSerie(@PathVariable String numeroSerie);

    @Operation(summary = "Obtenir les certificats générés par ID utilisateur", description = "Ce service permet de récupérer les certificats générés pour un utilisateur.")
    @GetMapping("/api/certificats/user/{utilisateurId}")
    List<CertificatsDto> getCertificatsByUserId(@PathVariable("utilisateurId") Long utilisateurId);

    @Operation(summary = "Mettre à jour le statut d'un certificat", description = "Ce service permet de mettre à jour le statut d'un certificat existant.")
    @PutMapping("/api/certificats/updateStatus/{idCertificat}")
    void updateCertificatStatus(@PathVariable("idCertificat") Long idCertificat,
            @RequestParam("statut") String nouveauStatut);

}
