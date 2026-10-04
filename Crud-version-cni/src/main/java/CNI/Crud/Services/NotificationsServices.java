package CNI.Crud.Services;

import java.util.List;
import java.util.Optional;

import CNI.Crud.Dto.NotificationsDto;
import CNI.Crud.Model.Notifications;
import CNI.Crud.Model.Utilisateurs;

public interface NotificationsServices {
    NotificationsDto sendNotification(NotificationsDto notificationsDto);

    void sendEmail(String destinataire, String sujet, String contenu);

    public List<Notifications> getNotificationsByUser(Utilisateurs utilisateur);

    public Notifications createNotification(Notifications notification);

    public Optional<Notifications> markAsRead(Integer notificationId);

    public void deleteNotification(Long notificationId);
}
