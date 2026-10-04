package CNI.Crud.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data

@NoArgsConstructor

@AllArgsConstructor

@Entity

@Table(name = "paiements")
public class Paiements extends EntiteAbstraite {

  @ManyToOne

  @JoinColumn(name = "utilisateur_id", nullable = false)
  private Utilisateurs utilisateur;

  @ManyToOne
  @JoinColumn(name = "sessions_id", nullable = false)
  private Sessions sessions;

  @Column(nullable = false)
  private Double montant;

  @Column(name = "date_paiement", nullable = false)
  private LocalDate datePaiement;

  @Column(nullable = false)
  private String statut;

  @Column(name = "mode_paiement", nullable = false)
  private String modePaiement;

  public Sessions getSessions() {
    return sessions;
  }

  public void setSessions(Sessions sessions) {
    this.sessions = sessions;
  }

}
