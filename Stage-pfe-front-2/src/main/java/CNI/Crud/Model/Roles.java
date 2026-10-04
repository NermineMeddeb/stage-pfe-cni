package CNI.Crud.Model;

import jakarta.persistence.Column;
  import jakarta.persistence.Entity;
  import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
  import jakarta.persistence.Table;
  import lombok.AllArgsConstructor;
  import lombok.Data;
  import lombok.NoArgsConstructor;
  
  @Data
  
  @NoArgsConstructor
  
  @AllArgsConstructor
  
  @Entity
  
 @Table(name = "roles")
  public class Roles extends EntiteAbstraite {
  
  @Column(name = "rolename")
  private String roleName;
  
  @ManyToOne
  
  @JoinColumn(name = "utilisateur_id")
  private Utilisateurs utilisateur;
 }
 
