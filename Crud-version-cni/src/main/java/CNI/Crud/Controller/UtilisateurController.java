package CNI.Crud.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import CNI.Crud.Controller.Api.UtilisateurApi;
import CNI.Crud.Dto.ChangerMotDePasseUtilisateurDto;
import CNI.Crud.Dto.UtilisateursDto;
import CNI.Crud.Services.UtilisateursServices;

@CrossOrigin(origins = "http://localhost:4200")

@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController implements UtilisateurApi {

    private UtilisateursServices utilisateurService;

    @Autowired
    public UtilisateurController(UtilisateursServices utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @Override
    public UtilisateursDto save(UtilisateursDto dto) {
        return utilisateurService.save(dto);
    }

    @Override
    public UtilisateursDto updateUtilisateurs(UtilisateursDto dto) {
        return utilisateurService.updateUtilisateurs(dto);
    }

    @Override
    public UtilisateursDto changerMotDePasse(ChangerMotDePasseUtilisateurDto dto) {
        return utilisateurService.changerMotDePasse(dto);
    }

    @Override
    public UtilisateursDto findById(Integer id) {
        return utilisateurService.findById(id);
    }

    @Override
    public UtilisateursDto findByEmail(String email) {
        return utilisateurService.findByEmail(email);
    }

    @Override
    public List<UtilisateursDto> findAll() {
        return utilisateurService.findAll();
    }

    @Override
    public void delete(Integer id) {
        utilisateurService.delete(id);
    }

    @Override
    public List<UtilisateursDto> findEtudiants() {
        return utilisateurService.findEtudiants();
    }

    @Override
    public List<UtilisateursDto> findFormateur() {
        return utilisateurService.findFormateur();
    }

    @Override
    public List<UtilisateursDto> findAdministrateurs() {
        return utilisateurService.findAdministrateurs();
    }

    public List<UtilisateursDto> findFormateurinterne() {
        return utilisateurService.findFormateurinterne();
    }

    public List<UtilisateursDto> findFormateurexterne() {
        return utilisateurService.findFormateurexterne();
    }

    public List<UtilisateursDto> findPersonnel_CNI() {
        return utilisateurService.findPersonnel_CNI();
    }

    public UtilisateursDto getUtilisateurByInscriptionId(@PathVariable Long id) {
        return utilisateurService.getUtilisateurByInscriptionId(id);
    }
}
