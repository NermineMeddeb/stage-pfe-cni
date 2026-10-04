package CNI.Crud.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import CNI.Crud.Dto.FormationsDto;
import CNI.Crud.Dto.SallesDto;
import CNI.Crud.Model.Salles;
import CNI.Crud.Repository.SallesRepository;

@Service

public interface SallesServices {

    public List<SallesDto> getAllSalles();
}
