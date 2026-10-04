package CNI.Crud.Controller.Api;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import CNI.Crud.Dto.SallesDto;
import CNI.Crud.Model.Salles;

public interface SallesApi {
    @GetMapping("/all")
    List<SallesDto> getAllSalles();



}