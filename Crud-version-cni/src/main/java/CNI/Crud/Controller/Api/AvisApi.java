package CNI.Crud.Controller.Api;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import CNI.Crud.Dto.AvisDto;
import io.swagger.v3.oas.annotations.Operation;

@RequestMapping("/api/commentaires")
public interface AvisApi {

    @Operation(summary = "Créer un commentaire", description = "Cette méthode permet de créer un nouveau commentaire pour une formation donnée. "
                    + "Elle prend en entrée un objet `AvisDto` et renvoie le commentaire créé avec son ID.")
    @PostMapping("/create")
    AvisDto save(@RequestBody AvisDto dto);

    @Operation(summary = "Récupérer un commentaire par son ID", description = "Cette méthode permet de récupérer un commentaire spécifique en utilisant son ID. "
                    + "Elle renvoie un objet `AvisDto` avec toutes les informations du commentaire.")
    @GetMapping("/{id}")
    AvisDto findById(@PathVariable("id") Long id); // Le type ID devrait être Long

    @Operation(summary = "Récupérer tous les commentaires", description = "Cette méthode permet de récupérer tous les commentaires enregistrés dans le système. "
                    + "Elle renvoie une liste d'objets `AvisDto`.")
    @GetMapping("/all")
    List<AvisDto> findAll();

    @Operation(summary = "Supprimer un commentaire", description = "Cette méthode permet de supprimer un commentaire en utilisant son ID. "
                    + "Elle ne renvoie pas de contenu après la suppression.")
    @DeleteMapping("/{id}")
    void delete(@PathVariable("id") Long id); // Le type ID devrait être Long
}
