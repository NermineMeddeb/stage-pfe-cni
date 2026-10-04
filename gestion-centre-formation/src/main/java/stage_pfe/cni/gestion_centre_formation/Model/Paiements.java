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
@EqualsAndHashCode
@Entity
@Table(name = "paiements")
public class Paiements extends EntiteAbstraite {

   @ManyToOne
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateurs utilisateur; // Relation avec l'entité Utilisateur 

    @ManyToOne
    @JoinColumn(name = "formation_id", nullable = false)
    private Formations formation; // Relation avec l'entité Formation

    @Column(nullable = false)
    private Double montant;

    @Column(name = "date_paiement", nullable = false)
    private LocalDateTime datePaiement;

    @Column(nullable = false)
    private String statut;

    @Column(name = "mode_paiement", nullable = false)
    private String modePaiement;

}
 */