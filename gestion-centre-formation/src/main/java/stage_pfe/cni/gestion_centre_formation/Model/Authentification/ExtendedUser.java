/* package stage_pfe.cni.gestion_centre_formation.Model.Authentification;

import java.util.Collection;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority; // Représente une autorité accordée à un utilisateur. C'est généralement un rôle ou une permission.
import org.springframework.security.core.userdetails.User; // Classe de Spring Security qui représente un utilisateur. Elle contient les informations de base sur l'utilisateur, comme le nom d'utilisateur, le mot de passe et les autorités.


public class ExtendedUser extends User {
  @Getter
  @Setter
  private Integer idEntreprise; // Identifiant de l'entreprise à laquelle l'utilisateur appartient

  // Constructeur principal
  public ExtendedUser(String username, String password,
      Collection<? extends GrantedAuthority> authorities) {
    super(username, password, authorities); // Appelle le constructeur de la classe User
  }

  // Constructeur avec idEntreprise
  public ExtendedUser(String username, String password, Integer idEntreprise,
      Collection<? extends GrantedAuthority> authorities) {
    super(username, password, authorities); // Appelle le constructeur de la classe User
    this.idEntreprise = idEntreprise; // Initialise l'identifiant de l'entreprise
  }
}
  */