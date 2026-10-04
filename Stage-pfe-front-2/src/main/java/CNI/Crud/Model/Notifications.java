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
 
 @EqualsAndHashCode(callSuper = true)
  
 @Table(name = "notifications")
 public class Notifications extends EntiteAbstraite {
 
@ManyToOne
 
 @JoinColumn(name = "utilisateur_id", nullable = false)
private Utilisateurs utilisateur; // Relation avec l'entité Utilisateur

@Column(nullable = false)
 private String contenu;
 
@Column(name = "date_creation", nullable = false)
 private LocalDateTime dateCreation;
 
 @Column(name = "date_envoi")
 private LocalDateTime dateEnvoi;
 
 @Column(nullable = false)
private String statut;
 
 }
 