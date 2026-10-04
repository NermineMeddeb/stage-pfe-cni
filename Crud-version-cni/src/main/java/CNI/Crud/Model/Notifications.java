package CNI.Crud.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true) // Si EntiteAbstraite a des méthodes equals et hashCode
@Table(name = "notifications")
public class Notifications extends EntiteAbstraite {

    @ManyToOne(fetch = FetchType.LAZY) // Utilisez Lazy fetching si vous ne voulez pas charger l'utilisateur tout de
                                       // suite
    @JoinColumn(name = "utilisateur_id", nullable = false) // Relation avec l'entité Utilisateur
    private Utilisateurs utilisateur;

    @Column(nullable = false)
    private String contenu;

    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation;

    @Column(name = "date_envoi")
    private LocalDateTime dateEnvoi;

    @Column(nullable = false)
    private String statut;

    @Column(nullable = false)
    private boolean estLue;
}
