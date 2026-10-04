package CNI.Crud.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import CNI.Crud.Controller.Api.AvisApi;
import CNI.Crud.Dto.AvisDto;
import CNI.Crud.Services.AvisServices;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class AvisController implements AvisApi {

    private final AvisServices avisService;

    @Autowired
    public AvisController(AvisServices avisService) {
        this.avisService = avisService;
    }

    @Override
    public AvisDto save(AvisDto dto) {
        return avisService.save(dto);
    }

    @Override
    public AvisDto findById(Long id) {
        return avisService.findById(id);
    }

    @Override
    public List<AvisDto> findAll() {
        return avisService.findAll();
    }

    @Override
    public void delete(Long id) {
        avisService.delete(id);
    }
}
