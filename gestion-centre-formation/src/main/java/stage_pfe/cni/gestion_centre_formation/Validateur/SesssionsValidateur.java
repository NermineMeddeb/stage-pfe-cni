package stage_pfe.cni.gestion_centre_formation.Validateur;
/* 
import stage_pfe.cni.gestion_centre_formation.Dto.FormationsDto;
import stage_pfe.cni.gestion_centre_formation.Dto.SessionsDto;
import stage_pfe.cni.gestion_centre_formation.Model.Sessions;

import java.util.ArrayList;
import java.util.List;
import org.springframework.util.StringUtils;

public class SesssionsValidateur {
    public static List<String> validate(SessionsDto dto) {

        List<String> errors = new ArrayList<>();

        if (dto == null) {
            errors.add("Veuillez renseigner les données de la formation");
            return errors;

        }
        if (dto.getFormationId() == null) {
            errors.add("L'ID de la formation est obligatoire");
        }

        if (dto.getSalleId() == null) {
            errors.add("L'ID de la salle est obligatoire");
        }

        if (dto.getDateDebut() == null) {
            errors.add("La date de début est obligatoire");
        }

        if (dto.getDateFin() == null) {
            errors.add("La date de fin est obligatoire");
        }

        if (dto.getDateDebut() != null && dto.getDateFin() != null && dto.getDateDebut().isAfter(dto.getDateFin())) {
            errors.add("La date de début ne peut pas être après la date de fin");
        }

        if (dto.getCapacite() == null || dto.getCapacite() <= 0) {
            errors.add("La capacité doit être supérieure à zéro");
        }

        if (dto.getPlacesDisponibles() == null || dto.getPlacesDisponibles() < 0) {
            errors.add("Le nombre de places disponibles ne peut pas être négatif");
        }

        if (dto.getPlacesDisponibles() != null && dto.getCapacite() != null
                && dto.getPlacesDisponibles() > dto.getCapacite()) {
            errors.add("Le nombre de places disponibles ne peut pas dépasser la capacité");
        }

        return errors;
    }
}
 */