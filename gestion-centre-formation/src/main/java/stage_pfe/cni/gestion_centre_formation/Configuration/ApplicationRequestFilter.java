/*  package stage_pfe.cni.gestion_centre_formation.Configuration;


import java.io.IOException;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import stage_pfe.cni.gestion_centre_formation.Services.Authentification.ApplicationUserDetailsService;
import stage_pfe.cni.gestion_centre_formation.Utils.JwtUtil;
import jakarta.servlet.FilterChain;

// Annotation @Component pour déclarer ce filtre comme un composant géré par Spring
@Component
public class ApplicationRequestFilter extends OncePerRequestFilter {

  // Injection de la classe utilitaire pour manipuler les tokens JWT
  @Autowired
  private JwtUtil jwtUtil;

  // Injection du service pour récupérer les détails de l'utilisateur de manière lazy (initialisation différée)
  @Autowired
  private ApplicationUserDetailsService userDetailsService;

  // Méthode qui sera exécutée pour chaque requête HTTP interceptée
  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws jakarta.servlet.ServletException, IOException {

    // Récupère le header "Authorization" de la requête
    final String authHeader = request.getHeader("Authorization");
    String userEmail = null;
    String jwt = null;
    String idEntreprise = null;

    // Vérifie si le header contient un token JWT et s'il commence par "Bearer "
    if(authHeader != null && authHeader.startsWith("Bearer ")) {
      // Extrait le token JWT du header
      jwt = authHeader.substring(7);
      // Extrait l'email de l'utilisateur et l'identifiant de l'entreprise à partir du token JWT
      userEmail = jwtUtil.extractUsername(jwt);
      idEntreprise = jwtUtil.extractIdEntreprise(jwt);
    }

    // Si l'email de l'utilisateur n'est pas null et que l'utilisateur n'est pas déjà authentifié
    if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
      // Récupère les détails de l'utilisateur à partir de son email
      UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
      
      // Valide le token JWT avec les informations de l'utilisateur
      if (jwtUtil.validateToken(jwt, userDetails)) {
        // Crée un objet d'authentification pour l'utilisateur
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
            userDetails, null, userDetails.getAuthorities()
        );
        // Ajoute des détails supplémentaires à l'authentification
        usernamePasswordAuthenticationToken.setDetails(
            new WebAuthenticationDetailsSource().buildDetails(request)
        );
        // Définit l'utilisateur comme authentifié dans le contexte de sécurité de Spring
        SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
      }
    }

    // Ajoute l'ID de l'entreprise au contexte MDC (Mapped Diagnostic Context) pour le logging
    MDC.put("idEntreprise", idEntreprise);

    // Passe la requête au filtre suivant dans la chaîne de filtres
    chain.doFilter(request, response);
  }
}
 */