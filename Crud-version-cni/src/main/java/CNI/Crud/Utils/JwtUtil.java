package CNI.Crud.Utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import CNI.Crud.Model.Authentification.ExtendedUser;

/**
 * Utilitaire pour la gestion des JSON Web Tokens (JWT).
 */
@Service
public class JwtUtil {

  private String SECRET_KEY = "secret"; // Clé secrète pour signer les tokens

  /**
   * Extrait le nom d'utilisateur du token.
   *
   * @param token Jeton JWT
   * @return Nom d'utilisateur
   */
  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject); // Extrait le sujet du token
  }

  /**
   * Extrait la date d'expiration du token.
   *
   * @param token Jeton JWT
   * @return Date d'expiration
   */
  public Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration); // Extrait la date d'expiration du token
  }

  /**
   * Extrait l'identifiant de l'entreprise à partir du token.
   *
   * @param token Jeton JWT
   * @return Identifiant de l'entreprise
   */
  public String extractIdEntreprise(String token) {
    final Claims claims = extractAllClaims(token); // Extrait toutes les revendications
    return claims.get("idEntreprise", String.class); // Récupère l'identifiant de l'entreprise
  }

  /**
   * Extrait une revendication spécifique du token.
   *
   * @param token          Jeton JWT
   * @param claimsResolver Fonction pour extraire la revendication
   * @param <T>            Type de la revendication
   * @return Valeur de la revendication
   */
  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token); // Extrait toutes les revendications
    return claimsResolver.apply(claims); // Applique la fonction de résolution
  }

  /**
   * Extrait toutes les revendications du token.
   *
   * @param token Jeton JWT
   * @return Revendications
   */
  private Claims extractAllClaims(String token) {
    return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody(); // Parse le token et retourne les
                                                                                    // revendications
  }

  /**
   * Vérifie si le token a expiré.
   *
   * @param token Jeton JWT
   * @return true si le token a expiré, sinon false
   */
  private Boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date()); // Vérifie si la date d'expiration est dépassée
  }

  /**
   * Génère un nouveau token JWT pour l'utilisateur.
   *
   * @param userDetails Détails de l'utilisateur
   * @return Jeton JWT
   */
  public String generateToken(ExtendedUser userDetails) {
    Map<String, Object> claims = new HashMap<>(); // Création d'une map pour les revendications
    return createToken(claims, userDetails); // Crée et retourne le token
  }

  /**
   * Crée un token JWT avec les revendications et les détails de l'utilisateur.
   *
   * @param claims      Revendications à inclure dans le token
   * @param userDetails Détails de l'utilisateur
   * @return Jeton JWT
   */
  private String createToken(Map<String, Object> claims, ExtendedUser userDetails) {
    return Jwts.builder().setClaims(claims)
        .setSubject(userDetails.getUsername()) // Définit le sujet du token
        .setIssuedAt(new Date(System.currentTimeMillis())) // Définit la date de création
        .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // Définit la date d'expiration (10
                                                                                   // heures)
                                                                         // les revendications
        .signWith(SignatureAlgorithm.HS256, SECRET_KEY).compact(); // Signe le token
  }

  /**
   * Valide le token JWT.
   *
   * @param token       Jeton JWT
   * @param userDetails Détails de l'utilisateur
   * @return true si le token est valide, sinon false
   */
  public Boolean validateToken(String token, UserDetails userDetails) {
    final String username = extractUsername(token); // Extrait le nom d'utilisateur du token
    return (username.equals(userDetails.getUsername()) && !isTokenExpired(token)); // Vérifie si le nom d'utilisateur
                                                                                   // correspond et si le token n'est
                                                                                   // pas expiré
  }
}
