package CNI.Crud.Configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import CNI.Crud.Services.Authentification.ApplicationUserDetailsService;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

  private final ApplicationUserDetailsService applicationUserDetailsService;
  private final ApplicationRequestFilter applicationRequestFilter;

  public SecurityConfiguration(ApplicationUserDetailsService applicationUserDetailsService,
                                ApplicationRequestFilter applicationRequestFilter) {
    this.applicationUserDetailsService = applicationUserDetailsService;
    this.applicationRequestFilter = applicationRequestFilter;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
      http
          .cors().and()
          .csrf(csrf -> csrf.disable())
          .authorizeHttpRequests(authorize -> authorize
              .requestMatchers( "/**").permitAll()
              .requestMatchers(
                  "/authentication/authenticate",
                  "/v2/api-docs",
                  "/swagger-resources/**",
                  "/swagger-ui.html",
                  "/webjars/**",
                  "/v3/api-docs/**",
                  "/api/**",
                  "/swagger-ui/**"
              ).permitAll()
              .anyRequest().authenticated()
          )
          .addFilterBefore(applicationRequestFilter, UsernamePasswordAuthenticationFilter.class);
  
      return http.build();
  }

  @Bean
  public AuthenticationManager authManager(HttpSecurity http) throws Exception {
    AuthenticationManagerBuilder authenticationManagerBuilder = http
        .getSharedObject(AuthenticationManagerBuilder.class);
    authenticationManagerBuilder
        .userDetailsService(applicationUserDetailsService)
        .passwordEncoder(passwordEncoder());
    return authenticationManagerBuilder.build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
