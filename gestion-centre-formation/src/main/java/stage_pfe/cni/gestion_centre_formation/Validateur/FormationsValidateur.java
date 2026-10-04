package stage_pfe.cni.gestion_centre_formation.Validateur;

import java.util.ArrayList;
import java.util.List;
import org.springframework.util.StringUtils;
import stage_pfe.cni.gestion_centre_formation.Dto.FormationsDto;

public class FormationsValidateur {

    public static List<String> validate(FormationsDto dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {
            errors.add("Veuillez renseigner les données de la formation");
            return errors;
        }

        // Validation du titre
        if (!StringUtils.hasLength(dto.getTitre())) {
            errors.add("Le titre de la formation est obligatoire");
        } else if (dto.getTitre().length() > 255) {
            errors.add("Le titre ne doit pas dépasser 255 caractères");
        }

        // Validation de la description
        if (!StringUtils.hasLength(dto.getDescription())) {
            errors.add("La description de la formation est obligatoire");
        }

        // Validation de la durée
        if (dto.getDuree() == null) {
            errors.add("La durée de la formation est obligatoire");
        } else if (dto.getDuree() <= 0) {
            errors.add("La durée de la formation doit être supérieure à 0");
        }

        // Validation du prix
        if (dto.getPrix() == null) {
            errors.add("Le prix de la formation est obligatoire");
        } else if (dto.getPrix() < 0) {
            errors.add("Le prix de la formation ne peut pas être négatif");
        }

        // Validation du niveau
        if (!StringUtils.hasLength(dto.getNiveau())) {
            errors.add("Le niveau de la formation est obligatoire");
        }

        // Validation du statut
        if (!StringUtils.hasLength(dto.getStatut())) {
            errors.add("Le statut de la formation est obligatoire");
        }

        // Validation du nombre de places
        if (dto.getPlacesMax() == null) {
            errors.add("Le nombre maximum de places est obligatoire");
        } else if (dto.getPlacesMax() <= 0) {
            errors.add("Le nombre maximum de places doit être supérieur à 0");
        }

        // Validation du thème
        if (dto.getThemeId() == null) {
            errors.add("Le thème de la formation est obligatoire");
        }

        // Validation des champs optionnels mais qui doivent respecter certaines règles
        // s'ils sont renseignés
        if (StringUtils.hasLength(dto.getPrerequis()) && dto.getPrerequis().length() > 1000) {
            errors.add("Les prérequis ne doivent pas dépasser 1000 caractères");
        }

        if (StringUtils.hasLength(dto.getObjectifsFormation()) && dto.getObjectifsFormation().length() > 1000) {
            errors.add("Les objectifs de formation ne doivent pas dépasser 1000 caractères");
        }

        if (StringUtils.hasLength(dto.getProgrammeDetaille()) && dto.getProgrammeDetaille().length() > 2000) {
            errors.add("Le programme détaillé ne doit pas dépasser 2000 caractères");
        }

        return errors;
    }

    // Méthode utilitaire pour valider le statut
    private static boolean isValidStatut(String statut) {
        if (statut == null)
            return false;
        // Liste des statuts valides
        return List.of("PLANIFIEE", "EN_COURS", "TERMINEE", "ANNULEE").contains(statut.toUpperCase());
    }

    // Méthode utilitaire pour valider le niveau
    private static boolean isValidNiveau(String niveau) {
        if (niveau == null)
            return false;
        // Liste des niveaux valides
        return List.of("DEBUTANT", "INTERMEDIAIRE", "AVANCE", "EXPERT").contains(niveau.toUpperCase());
    }
}