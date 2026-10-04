package CNI.Crud.Controller.Api;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import CNI.Crud.Dto.ChangerMotDePasseUtilisateurDto;
import CNI.Crud.Dto.UtilisateursDto;

public interface UtilisateurApi {
    @PostMapping("/create")
    UtilisateursDto save(@RequestBody UtilisateursDto dto);

    @PostMapping("/updateUtilisateurs")
    UtilisateursDto updateUtilisateurs(@RequestBody UtilisateursDto dto);

    @PostMapping("/update/password")
    UtilisateursDto changerMotDePasse(@RequestBody ChangerMotDePasseUtilisateurDto dto);

    @GetMapping("/{idUtilisateur}")
    UtilisateursDto findById(@PathVariable("idUtilisateur") Integer id);

    @GetMapping("/find/{email}")
    UtilisateursDto findByEmail(@PathVariable("email") String email);

    @GetMapping("/all")
    List<UtilisateursDto> findAll();

    @DeleteMapping("/delete/{idUtilisateur}")
    void delete(@PathVariable("idUtilisateur") Integer id);

    @GetMapping("/etudiants")
    List<UtilisateursDto> findEtudiants();

    @GetMapping("/formateurs")
    List<UtilisateursDto> findFormateur();

    @GetMapping("/administrateurs")
    List<UtilisateursDto> findAdministrateurs();

    @GetMapping("/findFormateurinternes")
    List<UtilisateursDto> findFormateurinterne();

    @GetMapping("/findFormateurexterne")
    List<UtilisateursDto> findFormateurexterne();

    @GetMapping("/Personnel_CNI")
    List<UtilisateursDto> findPersonnel_CNI();

    @GetMapping("/inscription/{id}")
    UtilisateursDto getUtilisateurByInscriptionId(@PathVariable Long id);

  

}
