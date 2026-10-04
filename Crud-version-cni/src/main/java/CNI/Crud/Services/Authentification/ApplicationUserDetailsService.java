package CNI.Crud.Services.Authentification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import CNI.Crud.Dto.UtilisateursDto;
import CNI.Crud.Model.Role;
import CNI.Crud.Model.Authentification.ExtendedUser;
import CNI.Crud.Services.UtilisateursServices;

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
        Role role = utilisateur.getRole();
        if (role != null) {
            authorities.add(new SimpleGrantedAuthority(role.name()));
        }

        return new ExtendedUser(utilisateur.getEmail(), utilisateur.getMotDePasse(), authorities);
    }
}