package CNI.Crud.Controller.Api;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import CNI.Crud.Controller.NotificationsController.EmailRequest;
import CNI.Crud.Dto.NotificationsDto;
import CNI.Crud.Model.Notifications;

import org.springframework.web.bind.annotation.RequestBody;

public interface NotificationsApi {
    @PostMapping("api/notifications/send")
    public NotificationsDto sendNotification(@RequestBody NotificationsDto notificationsDto);

    @PostMapping("api/notifications/send-email")
    public void sendEmail(@RequestBody EmailRequest EmailRequest);

    // Obtenir toutes les notifications d'un utilisateur
    @GetMapping("api/user/{userId}")
    public List<Notifications> getNotificationsByUser(@PathVariable Long userId); 

    // Créer une nouvelle notification
    @PostMapping("api/notifications/createNotification")

    public Notifications createNotification(@RequestBody Notifications notification);

    // Marquer une notification comme lue
    @PatchMapping("api/{notificationId}/read")
    public Optional<Notifications> markAsRead(@PathVariable Long notificationId);

    // Supprimer une notification
    @DeleteMapping("api/delete/{notificationId}")
    public void deleteNotification(@PathVariable Long notificationId);

}
