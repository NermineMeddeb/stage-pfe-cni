package CNI.Crud.Controller.Api;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import CNI.Crud.Dto.InscriptionDto;

@RequestMapping("/api/inscriptions")
public interface InscriptionApi {

  

    @GetMapping("/all")
    List<InscriptionDto> findAll();

 
}
