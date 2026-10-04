package CNI.Crud.Services;
import java.util.List;


import CNI.Crud.Dto.ThemesDto;

public interface ThemesServices {

    ThemesDto save(ThemesDto dto);
    ThemesDto findById(Long id); // ✅ Trouver un thème par ID

    List<ThemesDto> findAll(); // ✅ Liste de tous les thèmes

    List<ThemesDto> findByName(String name); // ✅ Recherche par nom


    ThemesDto assignThemeToFormation(Long themeId, Long formationId); // ✅ Associer un thème à une formation

    List<ThemesDto> findThemesByFormation(Long formationId); // ✅ Récupérer les thèmes liés à une formation

    ThemesDto update(Long id, ThemesDto dto); // ✅ Mise à jour d'un thème

    void delete(Long id); // ✅ Supprimer un thème

/*     List<ThemesDto> getSessionsByTheme(Long themeId);
 */    Boolean themeExists(String name); // ✅ Vérifier si un thème existe
}
 