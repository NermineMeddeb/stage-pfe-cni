package stage_pfe.cni.gestion_centre_formation.Validateur;
/* 
import java.util.ArrayList;
import java.util.List;
import org.springframework.util.StringUtils;
import stage_pfe.cni.gestion_centre_formation.Dto.ThemesDto;

public class ThemesValidateur {

    public static List<String> validate(ThemesDto dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {
            errors.add("Veuillez renseigner les données du thème");
            return errors;
        }

        if (!StringUtils.hasLength(dto.getNom())) {
            errors.add("Le nom du thème est obligatoire");
        } else if (dto.getNom().length() > 100) {
            errors.add("Le nom du thème ne doit pas dépasser 100 caractères");
        }

        if (dto.getFormationsIds() != null && dto.getFormationsIds().isEmpty()) {
            errors.add("La liste des formations ne doit pas être vide");
        }


        return errors;
    }
}
 */