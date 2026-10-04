package CNI.Crud.Controller.Api;

//import io.swagger.annotations.Api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import CNI.Crud.Dto.Authentification.AuthenticationRequest;
import CNI.Crud.Dto.Authentification.AuthenticationResponse;

public interface AuthenticationApi {

    @PostMapping("/authentication/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request);
}
