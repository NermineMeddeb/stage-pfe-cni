package CNI.Crud.Model.Authentification;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

public class ExtendedUser extends User {

    private static final long serialVersionUID = 1L;

    public ExtendedUser(String username, String password, 
            Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
    }
}