package CNI.Crud.Controller;

import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import CNI.Crud.Controller.Api.SallesApi;
import CNI.Crud.Dto.SallesDto;
import CNI.Crud.Model.Salles;
import CNI.Crud.Services.SallesServices;
@CrossOrigin(origins = "http://localhost:4200") // Autorise l'origine Angular

@RestController
@RequestMapping("/api/salles")
public class SallesController implements SallesApi {

    private final SallesServices sallesService;

    @Autowired
    public SallesController(SallesServices sallesService) {
        this.sallesService = sallesService;
    }

    @Override
    public List<SallesDto> getAllSalles() {
        return sallesService.getAllSalles();
    }

   
}