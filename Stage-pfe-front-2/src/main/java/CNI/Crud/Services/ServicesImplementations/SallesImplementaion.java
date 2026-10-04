package CNI.Crud.Services.ServicesImplementations;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import CNI.Crud.Dto.FormationsDto;
import CNI.Crud.Dto.InscriptionDto;
import CNI.Crud.Dto.SallesDto;
import CNI.Crud.Exceptions.ErrorCodes;
import CNI.Crud.Exceptions.InvalidEntityException;
import CNI.Crud.Repository.InscriptionRepository;
import CNI.Crud.Repository.SallesRepository;
import CNI.Crud.Services.SallesServices;
@Service
public class SallesImplementaion implements SallesServices {

    private final SallesRepository sallesRepository;

    @Autowired
    public SallesImplementaion(SallesRepository sallesRepository) {
        this.sallesRepository = sallesRepository;
    }

    @Override
    public List<SallesDto> getAllSalles() {
        try {
            return sallesRepository.findAll().stream()
                    .map(SallesDto::fromEntity)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new InvalidEntityException(
                    "Error while fetching salles",
                    e,
                    ErrorCodes.SALLE_NOT_FOUND);
        }
    }
}