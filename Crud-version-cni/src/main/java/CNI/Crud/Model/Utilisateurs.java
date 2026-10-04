package CNI.Crud.Model;

import java.time.LocalDate;


import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "utilisateurs")
public class Utilisateurs extends EntiteAbstraite {

    @Column(nullable = false, length = 100)
    private String nom;

    @NotEmpty(message = "La photo est obligatoire")
    private String photo;

    @Column(nullable = false, length = 100)
    private String prenom;

    @Email(message = "L'email doit être valide")
    @Column(nullable = false, unique = true)
    private String email;

    @NotEmpty(message = "Le mot de passe ne doit pas être vide")
    @Column(nullable = false)
    private String motDePasse;

    private String etablissement;
    private String cin;

    private LocalDate dateNaissance;

    @Column(length = 15)
    private String telephone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role; 
    

}
