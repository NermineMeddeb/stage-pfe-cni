package CNI.Crud.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import CNI.Crud.Controller.Api.CommentairesApi;
import CNI.Crud.Controller.Api.FormationsApi;
import CNI.Crud.Dto.CommentairesDto;
import CNI.Crud.Services.CommentairesServices;

@RestController
public class CommentairesController implements CommentairesApi {
    private final CommentairesServices commentaireService;

    @Autowired
    public CommentairesController(CommentairesServices commentaireService) {
        this.commentaireService = commentaireService;
    }

    @Override
    public CommentairesDto save(CommentairesDto dto) {
        return commentaireService.save(dto);
    }

    @Override
    public CommentairesDto findById(Integer id) {
        return commentaireService.findById(id);
    }

    @Override
    public List<CommentairesDto> findAll() {
        return commentaireService.findAll();
    }

    @Override
    public void delete(Integer id) {
        commentaireService.delete(id);
    }
}
