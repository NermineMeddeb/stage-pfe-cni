package CNI.Crud.Services;

import java.util.List;

import org.springframework.stereotype.Service;

import CNI.Crud.Dto.CommentairesDto;
public interface CommentairesServices {

    
    CommentairesDto save(CommentairesDto dto);
    CommentairesDto findById(Integer id);
    List<CommentairesDto> findAll();
    void delete(Integer id);
}
