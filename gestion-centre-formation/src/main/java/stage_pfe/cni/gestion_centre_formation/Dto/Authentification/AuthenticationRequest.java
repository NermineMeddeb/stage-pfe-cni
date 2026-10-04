package stage_pfe.cni.gestion_centre_formation.Dto.Authentification;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthenticationRequest {

  private String login;

  private String password;

}
