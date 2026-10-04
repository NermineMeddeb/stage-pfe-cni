/* package stage_pfe.cni.gestion_centre_formation.Controller.Api;

import java.util.List;

import static stage_pfe.cni.gestion_centre_formation.Utils.Constants.UTILISATEURS_ENDPOINT;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import stage_pfe.cni.gestion_centre_formation.Dto.ChangerMotDePasseUtilisateurDto;
import stage_pfe.cni.gestion_centre_formation.Dto.UtilisateursDto;

public interface UtilisateurApi {

    @PostMapping(UTILISATEURS_ENDPOINT + "/create")
    UtilisateursDto save(@RequestBody UtilisateursDto dto);

    @PostMapping(UTILISATEURS_ENDPOINT + "/update/password")
    UtilisateursDto changerMotDePasse(@RequestBody ChangerMotDePasseUtilisateurDto dto);

    @GetMapping(UTILISATEURS_ENDPOINT + "/{idUtilisateur}")
    UtilisateursDto findById(@PathVariable("idUtilisateur") Integer id);

    @GetMapping(UTILISATEURS_ENDPOINT + "/find/{email}")
    UtilisateursDto findByEmail(@PathVariable("email") String email);

    @GetMapping(UTILISATEURS_ENDPOINT + "/all")
    List<UtilisateursDto> findAll();

    @DeleteMapping(UTILISATEURS_ENDPOINT + "/delete/{idUtilisateur}")
    void delete(@PathVariable("idUtilisateur") Integer id);

}
 */