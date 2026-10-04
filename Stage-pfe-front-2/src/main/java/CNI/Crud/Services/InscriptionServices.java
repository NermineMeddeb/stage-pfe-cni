package CNI.Crud.Services;


import CNI.Crud.Dto.InscriptionDto;

import java.util.List;

import org.springframework.stereotype.Service;
@Service

public interface  InscriptionServices {
    List<InscriptionDto> findAll();
  
}
