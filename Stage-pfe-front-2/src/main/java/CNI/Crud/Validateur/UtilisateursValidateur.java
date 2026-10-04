package CNI.Crud.Validateur;

import java.util.ArrayList;
import java.util.List;

import org.springframework.util.StringUtils;
import CNI.Crud.Dto.UtilisateursDto;

public class UtilisateursValidateur {

    public static List<String> validate(UtilisateursDto utilisateursDto) {
        List<String> errors = new ArrayList<>();

        if (utilisateursDto == null) {
            errors.add("Erreur : L'objet utilisateur est null");
            return errors;
        }

        if (!StringUtils.hasText(utilisateursDto.getNom())) {
            errors.add("Erreur : Veuillez renseigner le nom d'utilisateur");
        }
        if (!StringUtils.hasText(utilisateursDto.getPrenom())) {
            errors.add("Erreur : Veuillez renseigner le prénom d'utilisateur");
        }
        if (!StringUtils.hasText(utilisateursDto.getEmail())) {
            errors.add("Erreur : Veuillez renseigner l'email d'utilisateur");
        } else if (!utilisateursDto.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            errors.add("Erreur : Veuillez renseigner un email valide");
        }
        if (!StringUtils.hasText(utilisateursDto.getMotDePasse())) {
            errors.add("Erreur : Veuillez renseigner le mot de passe d'utilisateur");
        }

        return errors;
    }
}
