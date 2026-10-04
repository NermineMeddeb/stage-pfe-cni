package stage_pfe.cni.gestion_centre_formation.Model;
/* 
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

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

  @Column(nullable = false, length = 100)
  private String prenom;

  @Email(message = "L'email doit être valide")
  @Column(nullable = false, unique = true)
  private String email;

  @NotEmpty(message = "Le mot de passe ne doit pas être vide")
  @Column(nullable = false)
  private String motDePasse;

  @Column(length = 15)
  private String telephone;

  @OneToMany(fetch = FetchType.EAGER, mappedBy = "utilisateur")
  @JsonIgnore
  private List<Roles> roles;

} */
