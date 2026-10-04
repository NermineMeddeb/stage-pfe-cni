package CNI.Crud.Configuration;

import java.io.IOException;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import CNI.Crud.Services.Authentification.ApplicationUserDetailsService;
import CNI.Crud.Utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.FilterChain;

@Component
public class ApplicationRequestFilter extends OncePerRequestFilter {

  @Autowired
  private JwtUtil jwtUtil;

  @Autowired
  private ApplicationUserDetailsService userDetailsService;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws jakarta.servlet.ServletException, IOException {

    final String authHeader = request.getHeader("Authorization");
    String userEmail = null;
    String jwt = null;

    System.out.println("=====> [Filter] Nouvelle requête interceptée");

    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      jwt = authHeader.substring(7);
      System.out.println("=====> [Filter] JWT trouvé : " + jwt);

      try {
        userEmail = jwtUtil.extractUsername(jwt);
        System.out.println("=====> [Filter] Email extrait du token : " + userEmail);
      } catch (Exception e) {
        System.out.println("=====> [Filter][Erreur] Impossible d'extraire l'email du JWT : " + e.getMessage());
      }

    } else {
      System.out.println("=====> [Filter] Aucun JWT présent dans la requête ou mauvais format.");
    }

    if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
      try {
        UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
        System.out.println("=====> [Filter] Détails utilisateur trouvés : " + userDetails.getUsername());

        if (jwtUtil.validateToken(jwt, userDetails)) {
          System.out.println("=====> [Filter] Le token est valide pour l'utilisateur : " + userEmail);

          UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
              new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

          usernamePasswordAuthenticationToken.setDetails(
              new WebAuthenticationDetailsSource().buildDetails(request)
          );

          SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
          System.out.println("=====> [Filter] Authentification définie dans le contexte Spring Security.");
        } else {
          System.out.println("=====> [Filter][Erreur] Token JWT invalide pour l'utilisateur : " + userEmail);
        }

      } catch (Exception e) {
        System.out.println("=====> [Filter][Erreur] Problème lors de la récupération des détails utilisateur : " + e.getMessage());
      }
    }

    chain.doFilter(request, response);
  }
}
