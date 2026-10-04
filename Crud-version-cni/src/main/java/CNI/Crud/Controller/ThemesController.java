
package CNI.Crud.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import CNI.Crud.Controller.Api.ThemesApi;
import CNI.Crud.Dto.ThemesDto;
import CNI.Crud.Services.ThemesServices;
@CrossOrigin(origins = "http://localhost:4200") 

@RestController

@RequestMapping("/api/themes")
public class ThemesController implements ThemesApi {

    private final ThemesServices themesServices;

    @Autowired
    public ThemesController(ThemesServices themesServices) {
        this.themesServices = themesServices;
    }

    public ThemesDto save(@RequestBody ThemesDto dto) {
        return themesServices.save(dto);
    }

    // ✅ Récupérer un thème par ID
    public ThemesDto findById(@PathVariable Long id) {
        return themesServices.findById(id);
    }

    // ✅ Récupérer tous les thèmes
    public List<ThemesDto> findAll() {
        return themesServices.findAll();
    }

    // ✅ Rechercher un thème par nom
    public List<ThemesDto> findByName(@RequestParam String name) {
        return themesServices.findByName(name);
    }

    public ThemesDto assignThemeToFormation(@PathVariable Long themeId, @PathVariable Long formationId) {
        return themesServices.assignThemeToFormation(themeId, formationId);
    }

    public List<ThemesDto> findThemesByFormation(@PathVariable Long formationId) {
        return themesServices.findThemesByFormation(formationId);
    }

    public ThemesDto updateTheme(@PathVariable Long id, @RequestBody ThemesDto dto) {
        return themesServices.update(id, dto);
    }

    public void delete(@PathVariable Long id) {
        themesServices.delete(id);
    }
    
  /*     public List<SessionsDto> getSessionsByTheme(@PathVariable Long themeId) {
      return themesServices.getSessionsByTheme(themeId);
     } */
     

    
     public Boolean themeExists(@PathVariable String name) {
      return themesServices.themeExists(name);
      }
     }
