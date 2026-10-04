/* package stage_pfe.cni.gestion_centre_formation.Dto;

import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Data;
import stage_pfe.cni.gestion_centre_formation.Model.Utilisateurs;

@Data
@Builder
public class UtilisateursDto {

    private Integer id;

    @NotNull(message = "Le nom est obligatoire")
    @Size(max = 100, message = "Le nom ne doit pas dépasser 100 caractères")
    private String nom;

    @NotNull(message = "Le prénom est obligatoire")
    @Size(max = 100, message = "Le prénom ne doit pas dépasser 100 caractères")
    private String prenom;

    @NotNull(message = "L'email est obligatoire")
    @Email(message = "L'email doit être valide")
    private String email;

    @NotNull(message = "Le mot de passe est obligatoire")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    private String motDePasse;

    @NotNull(message = "Le téléphone est obligatoire")
    @Pattern(regexp = "^[0-9]{10}$", message = "Le téléphone doit contenir 10 chiffres")
    private String telephone;

    @NotNull(message = "Les rôles sont obligatoires")
    private List<RolesDto> roles;

    public static UtilisateursDto fromEntity(Utilisateurs utilisateur) {
        if (utilisateur == null) {
            return null;
        }

        return UtilisateursDto.builder()
                .id(utilisateur.getId())
                .nom(utilisateur.getNom())
                .prenom(utilisateur.getPrenom())
                .email(utilisateur.getEmail())
                .motDePasse(utilisateur.getMotDePasse())
                .telephone(utilisateur.getTelephone())
                .roles(utilisateur.getRoles() != null ? 
                       utilisateur.getRoles().stream()
                       .map(RolesDto::fromEntity)
                       .collect(Collectors.toList()) 
                       : new ArrayList<>())
                .build();
    }

    public static Utilisateurs toEntity(UtilisateursDto dto) {
        if (dto == null) {
            return null;
        }

        Utilisateurs utilisateur = new Utilisateurs();
        utilisateur.setId(dto.getId());
        utilisateur.setNom(dto.getNom());
        utilisateur.setPrenom(dto.getPrenom());
        utilisateur.setEmail(dto.getEmail());
        utilisateur.setMotDePasse(dto.getMotDePasse());
        utilisateur.setTelephone(dto.getTelephone());
        utilisateur.setRoles(dto.getRoles() != null ?
                dto.getRoles().stream()
                .map(RolesDto::toEntity)
                .collect(Collectors.toList()) 
                : new ArrayList<>());

        return utilisateur;
    }
}
 */