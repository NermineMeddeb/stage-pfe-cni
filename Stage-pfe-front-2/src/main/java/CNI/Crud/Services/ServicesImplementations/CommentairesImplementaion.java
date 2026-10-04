package CNI.Crud.Services.ServicesImplementations;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import CNI.Crud.Dto.CommentairesDto;
import CNI.Crud.Model.Commentaires;
import CNI.Crud.Repository.CommentairesRepository;
import CNI.Crud.Services.CommentairesServices;
@Service
public class CommentairesImplementaion implements CommentairesServices {

    private final CommentairesRepository commentaireRepository;

    @Autowired
    public CommentairesImplementaion(CommentairesRepository commentaireRepository) {
        this.commentaireRepository = commentaireRepository;
    }

    @Override
    public CommentairesDto save(CommentairesDto dto) {
        Commentaires commentaire = CommentairesDto.toEntity(dto);
        Commentaires savedCommentaire = commentaireRepository.save(commentaire);
        return CommentairesDto.fromEntity(savedCommentaire);
    }

    @Override
    public CommentairesDto findById(Integer id) {
        Optional<Commentaires> commentaire = commentaireRepository.findById(id);
        return commentaire.map(CommentairesDto::fromEntity)
                .orElseThrow(() -> new RuntimeException("Commentaire not found with id: " + id));
    }

    @Override
    public List<CommentairesDto> findAll() {
        return commentaireRepository.findAll().stream()
                .map(CommentairesDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Integer id) {
        commentaireRepository.deleteById(id);
    }}