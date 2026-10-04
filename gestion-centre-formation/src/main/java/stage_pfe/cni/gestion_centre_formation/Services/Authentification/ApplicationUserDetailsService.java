/* package stage_pfe.cni.gestion_centre_formation.Services.Authentification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import stage_pfe.cni.gestion_centre_formation.Dto.UtilisateursDto;
import stage_pfe.cni.gestion_centre_formation.Model.Authentification.ExtendedUser;
import stage_pfe.cni.gestion_centre_formation.Services.UtilisateursServices;

import java.util.ArrayList;
import java.util.List;

@Service
public class ApplicationUserDetailsService implements UserDetailsService {

    @Autowired
    private UtilisateursServices service;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UtilisateursDto utilisateur = service.findByEmail(email);
        if (utilisateur == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        if (utilisateur.getRoles() != null) {
            utilisateur.getRoles().forEach(role -> 
                authorities.add(new SimpleGrantedAuthority(role.getRoleName()))
            );
        }


return new ExtendedUser(utilisateur.getEmail(), utilisateur.getMotDePasse(), null, authorities);
    }
}
  */