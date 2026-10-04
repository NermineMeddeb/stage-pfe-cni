package stage_pfe.cni.gestion_centre_formation.Configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/v3/api-docs/**",  // OpenAPI documentation
                    "/swagger-ui/**",   // Swagger UI
                    "/swagger-ui.html"  // Swagger main page
                ).permitAll()
                .anyRequest().authenticated()
            )
            .csrf(csrf -> csrf.disable()) // Désactiver CSRF pour éviter les blocages
            .formLogin().disable() // Désactiver la connexion par formulaire
            .httpBasic().disable(); // Désactiver l'authentification basique

        return http.build();
    }
}

  