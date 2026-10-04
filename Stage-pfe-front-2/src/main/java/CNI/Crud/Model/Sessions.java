package CNI.Crud.Model;

import jakarta.persistence.*;
  import lombok.AllArgsConstructor;
  import lombok.Builder;
 import lombok.Getter;
  import lombok.NoArgsConstructor;
  import lombok.Setter;
  
  import java.time.LocalDate;
  import java.util.List;

  @Entity
  
 @Builder
  
 @Getter
 
 @Setter
 
 @NoArgsConstructor
  
  @AllArgsConstructor
 
 @Table(name = "sessions")
 public class Sessions extends EntiteAbstraite {
  
 
 
 @ManyToOne
 
@JoinColumn(name = "formation_id", nullable = false)
 private Formations formation;
 
 @ManyToOne
 
 @JoinColumn(name = "Utilisateurs_id", nullable = false)
 private Utilisateurs Utilisateurs;
 
@ManyToOne
 
 @JoinColumn(name = "salle_id", nullable = false)
private Salles salle;
  
  @Column(name = "date_debut", nullable = false)
  private LocalDate dateDebut;
  
  @Column(name = "date_fin", nullable = false)
  private LocalDate dateFin;
  
  @Column(name = "capacite", nullable = false)
  private Integer capacite;
  
  @Column(name = "places_disponibles", nullable = false)
  private Integer placesDisponibles;
  
  @OneToMany(mappedBy = "session")
  private List<Inscription> inscriptions;
  
  }
 