package CNI.Crud.Services;

import java.util.List;
import CNI.Crud.Dto.AvisDto;

public interface AvisServices {

    AvisDto save(AvisDto dto);

    AvisDto findById(Long id); // Le type ID devrait être Long

    List<AvisDto> findAll();

    void delete(Long id); // Le type ID devrait être Long
}
