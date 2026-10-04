package CNI.Crud.Services.ServicesImplementations;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import CNI.Crud.Dto.ThemesDto;
import CNI.Crud.Exceptions.EntityNotFoundException;
import CNI.Crud.Exceptions.ErrorCodes;
import CNI.Crud.Exceptions.InvalidEntityException;
import CNI.Crud.Model.Formations;
import CNI.Crud.Model.Themes;
import CNI.Crud.Repository.FormationsRepository;
import CNI.Crud.Repository.ThemesRepository;
import CNI.Crud.Services.ThemesServices;
import CNI.Crud.Validateur.ThemesValidateur;


@Service
public class ThemesImplementation implements ThemesServices {

    private final ThemesRepository themesRepository;
    private final FormationsRepository formationsRepository;

    @Autowired
    public ThemesImplementation(ThemesRepository themesRepository,
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
}  */
 @Override
public List<ThemesDto> findByName(String name) {
    return themesRepository.findByNomContainingIgnoreCase(name).stream()
            .map(ThemesDto::fromEntity)
            .collect(Collectors.toList());
}


} 
