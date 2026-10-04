package CNI.Crud.Controller.Api;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import CNI.Crud.Dto.FormationsDto;
import CNI.Crud.Dto.SallesDto;
import io.swagger.v3.oas.annotations.Operation;

public interface SallesApi {

    @GetMapping("api/all")
    List<SallesDto> getAllSalles();

    @PostMapping("api/save")
    SallesDto save(@RequestBody SallesDto sallesDto);

    @GetMapping("api/salles/{id}")
    SallesDto findById(@PathVariable Integer id);

    @DeleteMapping("api/salles/{id}")
    void delete(@PathVariable Integer id);

    @Operation(summary = "Update une formation", description = "Cette méthode permet de updater une  formation dans le système.")
    @PutMapping("api/updateSalle")
    SallesDto updateSalle(@RequestBody SallesDto dto);

}
