package CNI.Crud.Dto;

import java.time.LocalDate;

import CNI.Crud.Model.Utilisateurs;
import CNI.Crud.Model.Role; // Importer l'énumération Role
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Data;

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
    @Pattern(regexp = "^[0-9]{8}$", message = "Le téléphone doit contenir 8 chiffres")
    private String telephone;

    @NotNull(message = "Le rôle est obligatoire")
    private Role role;  
    @NotNull(message = "La photo est obligatoire")
    private String photo;

    private String etablissement;
    private String cin;
    private LocalDate dateNaissance;

    // Méthode pour transformer l'entité Utilisateurs en DTO
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
                .photo(utilisateur.getPhoto())
                .etablissement(utilisateur.getEtablissement())
                .cin(utilisateur.getCin())
                .dateNaissance(utilisateur.getDateNaissance())
                .role(utilisateur.getRole()) // Mapper le rôle de l'entité
                .build();
    }

    // Méthode pour transformer le DTO en entité Utilisateurs
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
        utilisateur.setPhoto(dto.getPhoto());
        utilisateur.setEtablissement(dto.getEtablissement());
        utilisateur.setCin(dto.getCin());
        utilisateur.setDateNaissance(dto.getDateNaissance());
        utilisateur.setRole(dto.getRole()); // Mapper le rôle du DTO

        return utilisateur;
    }
}
