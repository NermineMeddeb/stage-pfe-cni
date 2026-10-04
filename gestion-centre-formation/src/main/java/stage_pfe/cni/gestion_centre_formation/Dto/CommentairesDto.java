package stage_pfe.cni.gestion_centre_formation.Dto;
/* 
import lombok.Builder;
import lombok.Data;
import stage_pfe.cni.gestion_centre_formation.Model.Commentaires;

import java.time.LocalDateTime;

@Data
@Builder
public class CommentairesDto {

    private Integer id;
    private Integer utilisateurId; // ID de l'utilisateur
    private Integer formationId; // ID de la formation
    private Integer note; // La note attribuée
    private String commentaire; // Contenu du commentaire
    private LocalDateTime date; // Date et heure du commentaire

    public static CommentairesDto fromEntity(Commentaires commentaires) {
        if (commentaires == null) {
            return null;
        }

        return CommentairesDto.builder()
                .id(commentaires.getId())
                .utilisateurId(commentaires.getUtilisateur() != null ? commentaires.getUtilisateur().getId() : null)
                .formationId(commentaires.getFormation() != null ? commentaires.getFormation().getId() : null)
                .note(commentaires.getNote())
                .commentaire(commentaires.getCommentaire())
                .date(commentaires.getDate())
                .build();
    }

    public static Commentaires toEntity(CommentairesDto dto) {
        if (dto == null) {
            return null;
        }

        Commentaires commentaires = new Commentaires();
        commentaires.setId(dto.getId());
        // Les relations utilisateur et formation doivent être gérées séparément dans le
        // service
        commentaires.setNote(dto.getNote());
        commentaires.setCommentaire(dto.getCommentaire());
        commentaires.setDate(dto.getDate());
        return commentaires;
    }
} */
