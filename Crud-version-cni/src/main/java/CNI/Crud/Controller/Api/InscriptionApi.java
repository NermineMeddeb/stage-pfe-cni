package CNI.Crud.Controller.Api;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import CNI.Crud.Dto.InscriptionDto;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.transaction.Transactional;

@RequestMapping("/api/inscriptions")
public interface InscriptionApi {

  @Operation(summary = "Créer une nouvelle inscription", description = "Cette méthode permet d'enregistrer une nouvelle inscription dans le système.")
  @PostMapping("/add")
  InscriptionDto saveInscription(@RequestBody InscriptionDto dto);

  @Operation(summary = "Lister toutes les inscriptions", description = "Cette méthode permet de récupérer la liste complète des inscriptions enregistrées.")
  @GetMapping("/all")
  List<InscriptionDto> findAll();

  @Operation(summary = "Récupérer une inscription par ID", description = "Cette méthode permet de récupérer une inscription en fournissant son ID.")
  @GetMapping("/{id}")
  InscriptionDto getInscriptionById(@PathVariable Long id);

  @Operation(summary = "Mettre à jour une inscription", description = "Cette méthode permet de modifier une inscription existante.")
  @PutMapping("/update/{id}")
  InscriptionDto updateInscription(@PathVariable Long id, @RequestBody InscriptionDto inscriptionDto);

  @Operation(summary = "Supprimer une inscription", description = "Cette méthode permet de supprimer une inscription par son ID.")
  @DeleteMapping("/delete/{id}")
  void deleteInscription(@PathVariable Long id);

  @Operation(summary = "Rechercher des inscriptions par statut", description = "Cette méthode permet de récupérer toutes les inscriptions correspondant à un statut spécifique.")
  @GetMapping("/status/{statut}")
  List<InscriptionDto> findByStatut(@PathVariable String statut);

  @GetMapping(value = "/getInscriptionsNonGenerees")
  @Operation(summary = "Récupérer les inscriptions où le certificat n'est pas généré", description = "Cette méthode permet de récupérer les inscriptions où le champ 'certificateGenerated' est égal à 0")
  List<InscriptionDto> getInscriptionsNonGenerees();

  @PutMapping("/update-certificat-de-0-a-1/{id}")
  @Operation(summary = "Mise à jour d'une inscription pour générer un certificat", description = "Passe le champ 'certificateGenerated' à 1 pour l'inscription correspondante")
  void transformCertificatToGenerate(@PathVariable Long id);
  
  @PutMapping("/update-certificat-genere-de-1-a-0/{id}")
  @Operation(summary = "Mise à jour d'une inscription pour annuler la génération du certificat", description = "Passe le champ 'certificateGenerated' à 0 pour l'inscription correspondante")
  void transformCertificatToNonGenerate(@PathVariable Long id);
  
}
