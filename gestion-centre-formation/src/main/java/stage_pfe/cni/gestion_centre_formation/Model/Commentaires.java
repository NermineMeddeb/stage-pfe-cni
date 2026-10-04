package stage_pfe.cni.gestion_centre_formation.Model;
/* 
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "commentaires")
public class Commentaires extends EntiteAbstraite {

   @ManyToOne
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateurs utilisateur; // Relation avec l'entité Utilisateur 

    @ManyToOne
    @JoinColumn(name = "formation_id", nullable = false)
    private Formations formation; // Relation avec l'entité Formation

    @Column(nullable = false)
    private Integer note; // La note attribuée (ex. : sur 5 ou 10)

    @Column(nullable = false, length = 500)
    private String commentaire; // Contenu du commentaire

    @Column(nullable = false)
    private LocalDateTime date; // Date et heure du commentaire

}
 */