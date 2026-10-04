package CNI.Crud.Validateur;

import CNI.Crud.Dto.PaiementsDto;
import org.springframework.util.StringUtils;
import java.util.ArrayList;
import java.util.List;

public class PaiementsValidateur {

    public static List<String> validate(PaiementsDto dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {
            errors.add("Veuillez renseigner les informations du paiement");
            return errors;
        }

        // Validation de l'utilisateur
        if (dto.getUtilisateurId() == null) {
            errors.add("L'utilisateur associé au paiement est obligatoire");
        }

        // Validation de la formation
        if (dto.getSessionsId() == null) {
            errors.add("La sessions associée au paiement est obligatoire");
        }

        // Validation du montant
        if (dto.getMontant() == null) {
            errors.add("Le montant du paiement est obligatoire");
        } else if (dto.getMontant() <= 0) {
            errors.add("Le montant du paiement doit être supérieur à 0");
        }

        // Validation de la date de paiement
        if (dto.getDatePaiement() == null) {
            errors.add("La date du paiement est obligatoire");
        }

        // Validation du mode de paiement
        if (!StringUtils.hasLength(dto.getModePaiement())) {
            errors.add("Le mode de paiement est obligatoire");
        } else if (!isValidModePaiement(dto.getModePaiement())) {
            errors.add("Le mode de paiement doit être l'un des suivants : CARTE, VIREMENT, ESPECES,CHEQUE");
        }

        // Validation du statut
        if (!StringUtils.hasLength(dto.getStatut())) {
            errors.add("Le statut du paiement est obligatoire");
        } else if (!isValidStatut(dto.getStatut())) {
            errors.add("Le statut du paiement doit être : EN_ATTENTE, CONFIRME, ANNULE");
        }

        return errors;
    }

    // Méthode pour valider les statuts autorisés
    private static boolean isValidStatut(String statut) {
        return List.of("EN_ATTENTE", "CONFIRME", "ANNULE", "REMBOURSE").contains(statut.toUpperCase());
    }

    // Méthode pour valider les modes de paiement autorisés
    private static boolean isValidModePaiement(String modePaiement) {
        return List.of("CARTE", "PAYPAL", "VIREMENT", "ESPECES","CHEQUE").contains(modePaiement.toUpperCase());
    }
}
