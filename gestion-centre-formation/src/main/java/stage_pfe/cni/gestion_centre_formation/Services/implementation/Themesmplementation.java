package stage_pfe.cni.gestion_centre_formation.Services.implementation;

/* import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import springfox.documentation.swagger2.mappers.ModelMapper;
import stage_pfe.cni.gestion_centre_formation.Dto.FormationsDto;
import stage_pfe.cni.gestion_centre_formation.Dto.ThemesDto;
import stage_pfe.cni.gestion_centre_formation.Dto.ThemesDto;
import stage_pfe.cni.gestion_centre_formation.Exceptions.EntityNotFoundException;
import stage_pfe.cni.gestion_centre_formation.Exceptions.ErrorCodes;
import stage_pfe.cni.gestion_centre_formation.Exceptions.InvalidEntityException;
import stage_pfe.cni.gestion_centre_formation.Model.Formations;
import stage_pfe.cni.gestion_centre_formation.Model.Salles;
import stage_pfe.cni.gestion_centre_formation.Model.Sessions;
import stage_pfe.cni.gestion_centre_formation.Model.Themes;
import stage_pfe.cni.gestion_centre_formation.Model.Utilisateurs;
import stage_pfe.cni.gestion_centre_formation.Repository.FormationsRepository;
import stage_pfe.cni.gestion_centre_formation.Repository.ThemesRepository;
import stage_pfe.cni.gestion_centre_formation.Services.ThemesServices;
import stage_pfe.cni.gestion_centre_formation.Validateur.FormationsValidateur;
import stage_pfe.cni.gestion_centre_formation.Validateur.SesssionsValidateur;
import stage_pfe.cni.gestion_centre_formation.Validateur.ThemesValidateur;

@Service
public class Themesmplementation implements ThemesServices {

    private final ThemesRepository themesRepository;
    private final FormationsRepository formationsRepository;

    @Autowired
    public Themesmplementation(ThemesRepository themesRepository,
                                       FormationsRepository formationsRepository
                                        ) {
        this.themesRepository = themesRepository;
        this.formationsRepository = formationsRepository;
    }

    @Override
    public ThemesDto save(ThemesDto dto) {
        List<String> errors = ThemesValidateur.validate(dto);
        if (!errors.isEmpty()) {
          //  log.error("Theme is not valid {}", dto);
            throw new InvalidEntityException("Theme is not valid", ErrorCodes.THEME_NOT_FOUND, errors);
        }

        try {
            return ThemesDto.fromEntity(themesRepository.save(ThemesDto.toEntity(dto)));
        } catch (Exception e) {
            throw new InvalidEntityException("Error while saving theme", e, ErrorCodes.THEME_NOT_FOUND);
        }
    }

    @Override
    public ThemesDto findById(Long id) {
        return themesRepository.findById(id)
                .map(ThemesDto::fromEntity)
                .orElseThrow(() -> new EntityNotFoundException("No theme found with ID = " + id, ErrorCodes.THEME_NOT_FOUND));
    }

    @Override
    public List<ThemesDto> findAll() {
        return themesRepository.findAll().stream()
                .map(ThemesDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public ThemesDto assignThemeToFormation(Long themeId, Long formationId) {
        Themes theme = themesRepository.findById(themeId)
                .orElseThrow(() -> new RuntimeException("Theme not found"));
        Formations formation = formationsRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation not found"));

        // Associer le thème à la formation
        theme.getFormations().add(formation);
        formationsRepository.save(formation); // Assurez-vous que la formation est bien mise à jour

        return ThemesDto.fromEntity(themesRepository.save(theme));
    }

    @Override
    public List<ThemesDto> findThemesByFormation(Long formationId) {
        return themesRepository.findThemesByFormation(formationId).stream()
                .map(ThemesDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public ThemesDto update(Long id, ThemesDto dto) {
        Themes theme = themesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Theme not found"));
        theme.setNom(dto.getNom());
        theme.setNom(dto.getNom());
        return ThemesDto.fromEntity(themesRepository.save(theme));
    }

    @Override
    public void delete(Long id) {
        themesRepository.deleteById(id);
    }

    @Override
    public Boolean themeExists(String name) {
        return themesRepository.existsByNom(name);
    }
  
/* @Override
public List<ThemesDto> getSessionsByTheme(Long themeId) {
    Themes theme = themesRepository.findById(themeId)
            .orElseThrow(() -> new RuntimeException("Thème non trouvé"));
    return theme.getFormations().stream()
            .map(session -> modelMapper.map(session, ThemesDto.class))
            .collect(Collectors.toList());
} */
/* @Override
public List<ThemesDto> findByName(String name) {
    return themesRepository.findByNomContainingIgnoreCase(name).stream()
            .map(ThemesDto::fromEntity)
            .collect(Collectors.toList());
}


} */ 
