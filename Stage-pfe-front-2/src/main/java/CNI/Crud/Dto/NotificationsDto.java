/*
 * package CNI.Crud.Dto;
 * 
 * import lombok.Builder;
 * import lombok.Data;
 * import stage_pfe.cni.gestion_centre_formation.Model.Notifications;
 * import stage_pfe.cni.gestion_centre_formation.Model.Utilisateurs;
 * 
 * import java.time.LocalDateTime;
 * 
 * @Data
 * 
 * @Builder
 * public class NotificationsDto {
 * 
 * private Integer id;
 * private Integer utilisateurId;
 * private String contenu;
 * private LocalDateTime dateCreation;
 * private LocalDateTime dateEnvoi;
 * private String statut;
 * 
 * public static NotificationsDto fromEntity(Notifications notifications) {
 * if (notifications == null) {
 * return null;
 * }
 * 
 * return NotificationsDto.builder()
 * .id(notifications.getId())
 * .utilisateurId(notifications.getUtilisateur() != null ?
 * notifications.getUtilisateur().getId() : null)
 * .contenu(notifications.getContenu())
 * .dateCreation(notifications.getDateCreation())
 * .dateEnvoi(notifications.getDateEnvoi())
 * .statut(notifications.getStatut())
 * .build();
 * }
 * 
 * 
 * public static Notifications toEntity(NotificationsDto dto, Utilisateurs
 * utilisateur) {
 * if (dto == null) {
 * return null;
 * }
 * 
 * Notifications notifications = new Notifications();
 * notifications.setId(dto.getId());
 * notifications.setUtilisateur(utilisateur);
 * notifications.setContenu(dto.getContenu());
 * notifications.setDateCreation(dto.getDateCreation());
 * notifications.setDateEnvoi(dto.getDateEnvoi());
 * notifications.setStatut(dto.getStatut());
 * return notifications;
 * }
 * }
 */