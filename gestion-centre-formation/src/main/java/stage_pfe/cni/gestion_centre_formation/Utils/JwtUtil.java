/*  package stage_pfe.cni.gestion_centre_formation.Utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import stage_pfe.cni.gestion_centre_formation.Model.Authentification.ExtendedUser;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;


@Service
public class JwtUtil {

  private String SECRET_KEY = "secret"; // Clé secrète pour signer les tokens

public String extractUsername(String token) {
  return extractClaim(token, Claims::getSubject); // Extrait le sujet du token
}


  public Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration); // Extrait la date d'expiration du token
  }


  public String extractIdEntreprise(String token) {
    final Claims claims = extractAllClaims(token); // Extrait toutes les revendications
    return claims.get("idEntreprise", String.class); // Récupère l'identifiant de l'entreprise
  }

  
  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token); // Extrait toutes les revendications
    return claimsResolver.apply(claims); // Applique la fonction de résolution
  }

  private Claims extractAllClaims(String token) {
    return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody(); // Parse le token et retourne les revendications
  }

  
  private Boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date()); // Vérifie si la date d'expiration est dépassée
  }

  
  public String generateToken(ExtendedUser userDetails) {
    Map<String, Object> claims = new HashMap<>(); // Création d'une map pour les revendications
    return createToken(claims, userDetails); // Crée et retourne le token
  }

  private String createToken(Map<String, Object> claims, ExtendedUser userDetails) {
    return Jwts.builder().setClaims(claims)
        .setSubject(userDetails.getUsername()) // Définit le sujet du token
        .setIssuedAt(new Date(System.currentTimeMillis())) // Définit la date de création
        .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // Définit la date d'expiration (10 heures)
        .claim("idEntreprise", userDetails.getIdEntreprise().toString()) // Ajoute l'identifiant de l'entreprise dans les revendications
        .signWith(SignatureAlgorithm.HS256, SECRET_KEY).compact(); // Signe le token
  }


  public Boolean validateToken(String token, UserDetails userDetails) {
    final String username = extractUsername(token); // Extrait le nom d'utilisateur du token
    return (username.equals(userDetails.getUsername()) && !isTokenExpired(token)); // Vérifie si le nom d'utilisateur correspond et si le token n'est pas expiré
  } 
}
  */