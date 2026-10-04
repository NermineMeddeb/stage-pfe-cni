package CNI.Crud.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data

@NoArgsConstructor

@AllArgsConstructor

@EqualsAndHashCode(callSuper = true)

@Entity

@Table(name = "salles")
public class Salles extends EntiteAbstraite {

  @NotEmpty(message = "Le nom de la salle ne doit pas être vide")

  @Column(nullable = false, length = 50)
  private String nom;

  @Positive(message = "La capacité doit être un nombre positif")

  @Column(nullable = false)
  private Integer capacite;

  @NotEmpty(message = "L'équipement ne doit pas être vide")

  @Column(nullable = false, length = 100)
  private String equipement;

  @NotEmpty(message = "Le statut ne doit pas être vide")

  @Column(nullable = false, length = 20)
  private String statut;

}
