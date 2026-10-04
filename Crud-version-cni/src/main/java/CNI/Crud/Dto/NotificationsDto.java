package CNI.Crud.Dto;

import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

import CNI.Crud.Model.Notifications;
import CNI.Crud.Model.Utilisateurs;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationsDto {

    private Integer id;
    private Integer utilisateurId;
    private String contenu;
    private LocalDateTime dateCreation;
    private LocalDateTime dateEnvoi;
    private String statut;
    private boolean estLue;


    public static NotificationsDto fromEntity(Notifications notifications) {
        if (notifications == null) {
            return null;
        }

        return NotificationsDto.builder()
                .id(notifications.getId())
                .utilisateurId(notifications.getUtilisateur() != null ? notifications.getUtilisateur().getId() : null)
                .contenu(notifications.getContenu())
                .dateCreation(notifications.getDateCreation())
                .dateEnvoi(notifications.getDateEnvoi())
                .statut(notifications.getStatut())
                .estLue(notifications.isEstLue())
                .build();
    }

    public static Notifications toEntity(NotificationsDto dto, Utilisateurs utilisateur) {
        if (dto == null) {
            return null;
        }

        Notifications notifications = new Notifications();
        notifications.setId(dto.getId());
        notifications.setUtilisateur(utilisateur);
        notifications.setContenu(dto.getContenu());
        notifications.setDateCreation(dto.getDateCreation() != null ? dto.getDateCreation() : LocalDateTime.now());
        notifications.setDateEnvoi(dto.getDateEnvoi());
        notifications.setStatut(dto.getStatut());
        notifications.setEstLue(dto.isEstLue());

        return notifications;
    }
}
