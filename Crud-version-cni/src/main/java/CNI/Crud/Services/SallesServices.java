package CNI.Crud.Services;

import java.util.List;

import org.springframework.stereotype.Service;

import CNI.Crud.Dto.FormationsDto;
import CNI.Crud.Dto.SallesDto;

@Service

public interface SallesServices {

    public List<SallesDto> getAllSalles();

    SallesDto save(SallesDto dto);

    SallesDto findById(Integer id);

    void delete(Integer id);

    SallesDto updateSalle(SallesDto dto);

}
