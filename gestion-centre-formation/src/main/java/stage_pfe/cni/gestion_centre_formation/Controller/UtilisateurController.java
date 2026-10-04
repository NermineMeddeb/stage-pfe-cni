/* package stage_pfe.cni.gestion_centre_formation.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import stage_pfe.cni.gestion_centre_formation.Controller.Api.ThemesApi;
import stage_pfe.cni.gestion_centre_formation.Controller.Api.UtilisateurApi;
import stage_pfe.cni.gestion_centre_formation.Dto.ChangerMotDePasseUtilisateurDto;
import stage_pfe.cni.gestion_centre_formation.Dto.UtilisateursDto;
import stage_pfe.cni.gestion_centre_formation.Services.UtilisateursServices;
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
} 
 */