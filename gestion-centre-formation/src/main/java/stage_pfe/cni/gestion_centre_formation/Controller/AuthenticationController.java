/*  package stage_pfe.cni.gestion_centre_formation.Controller;

import stage_pfe.cni.gestion_centre_formation.Controller.Api.AuthenticationApi;
import stage_pfe.cni.gestion_centre_formation.Dto.Authentification.AuthenticationRequest;
import stage_pfe.cni.gestion_centre_formation.Dto.Authentification.AuthenticationResponse;
import stage_pfe.cni.gestion_centre_formation.Model.Authentification.ExtendedUser;
import stage_pfe.cni.gestion_centre_formation.Services.Authentification.ApplicationUserDetailsService;
import stage_pfe.cni.gestion_centre_formation.Utils.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;


@RestController
@CrossOrigin(origins = "*") // Permet d'accepter des requêtes depuis n'importe quelle origine
public class AuthenticationController implements AuthenticationApi {

    @Autowired
    private AuthenticationManager authenticationManager; // Gère l'authentification des utilisateurs

    @Autowired
    private ApplicationUserDetailsService userDetailsService; // Service pour charger les détails de l'utilisateur

    @Autowired
    private JwtUtil jwtUtil; // Utilitaire pour la gestion des tokens JWT

 
     @Override
    public ResponseEntity<AuthenticationResponse> authenticate(AuthenticationRequest request) {
        try {
            // Authentifie l'utilisateur avec les informations fournies
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getLogin(), // Nom d'utilisateur
                    request.getPassword() // Mot de passe
                )
            );

            // Charge les détails de l'utilisateur
            final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getLogin());

            // Génère un token JWT pour l'utilisateur authentifié
            final String jwt = jwtUtil.generateToken((ExtendedUser) userDetails);

            // Retourne le token dans la réponse
            return ResponseEntity.ok(AuthenticationResponse.builder().accessToken(jwt).build());

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(AuthenticationResponse.builder().accessToken(null).build());
        }
    }
} */