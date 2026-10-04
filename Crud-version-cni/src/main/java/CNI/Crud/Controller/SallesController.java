package CNI.Crud.Controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;

import org.springframework.beans.factory.annotation.Autowired;
import CNI.Crud.Controller.Api.SallesApi;
import CNI.Crud.Dto.FormationsDto;
import CNI.Crud.Dto.SallesDto;
import CNI.Crud.Services.SallesServices;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
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

    @Override
    public SallesDto save(@RequestBody SallesDto sallesDto) {
        return sallesService.save(sallesDto);
    }

    @Override
    public SallesDto findById(@PathVariable Integer id) {
        return sallesService.findById(id);
    }

    @Override
    public void delete(@PathVariable Integer id) {
        sallesService.delete(id);
    }

    @Override
    public SallesDto updateSalle(SallesDto dto) {
        return sallesService.updateSalle(dto);
    }
}
