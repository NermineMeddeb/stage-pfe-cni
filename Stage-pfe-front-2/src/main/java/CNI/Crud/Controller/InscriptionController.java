package CNI.Crud.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import CNI.Crud.Controller.Api.FormationsApi;
import CNI.Crud.Controller.Api.InscriptionApi;
import CNI.Crud.Dto.InscriptionDto;
import CNI.Crud.Services.InscriptionServices;
@RestController

public class InscriptionController implements InscriptionApi{
 private final InscriptionServices inscriptionService;

    @Autowired
    public InscriptionController(InscriptionServices inscriptionService) {
        this.inscriptionService = inscriptionService;
    }
public List<InscriptionDto> findAll() {
        return inscriptionService.findAll();
    }


}
