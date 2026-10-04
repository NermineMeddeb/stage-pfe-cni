package CNI.Crud.Controller;

import java.util.List;
import java.util.Optional;

import javax.management.Notification;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import CNI.Crud.Controller.Api.NotificationsApi;
import CNI.Crud.Dto.NotificationsDto;
import CNI.Crud.Model.Notifications;
import CNI.Crud.Model.Utilisateurs;
import CNI.Crud.Repository.UtilisateursRepository;
import CNI.Crud.Services.NotificationsServices;
import io.swagger.v3.oas.annotations.parameters.RequestBody;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class NotificationsController implements NotificationsApi {
    private final NotificationsServices NotificationsServices;
    private final UtilisateursRepository utilisateursRepository;
    public NotificationsController(NotificationsServices NotificationsServices, UtilisateursRepository utilisateursRepository) {
        this.utilisateursRepository = utilisateursRepository;
        this.NotificationsServices = NotificationsServices;
    }

    @Override
    public NotificationsDto sendNotification(@RequestBody NotificationsDto notificationsDto) {
        return NotificationsServices.sendNotification(notificationsDto);
    }

    @Override
    public void sendEmail(@RequestBody EmailRequest EmailRequest) {
        NotificationsServices.sendEmail(EmailRequest.getDestinataire(), EmailRequest.getSujet(),
                EmailRequest.getContenu());
    }

    // EmailRequest pour recevoir les détails de l'email
    public static class EmailRequest {
        private String destinataire;
        private String sujet;
        private String contenu;

        // Getters et setters
        public String getDestinataire() {
            return destinataire;
        }

        public void setDestinataire(String destinataire) {
            this.destinataire = destinataire;
        }

        public String getSujet() {
            return sujet;
        }

        public void setSujet(String sujet) {
            this.sujet = sujet;
        }

        public String getContenu() {
            return contenu;
        }

        public void setContenu(String contenu) {
            this.contenu = contenu;
        }
    }

    @Override
    public List<Notifications> getNotificationsByUser(@PathVariable Long userId) {
        Utilisateurs utilisateur = utilisateursRepository.findById(userId.intValue())
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return NotificationsServices.getNotificationsByUser(utilisateur);
    }
    

    @Override
    // Créer une nouvelle notification
    public Notifications createNotification(@RequestBody Notifications notification) {
        return NotificationsServices.createNotification(notification);
    }

    @Override
    // Marquer une notification comme lue
    public Optional<Notifications> markAsRead(@PathVariable Long notificationId) {
        return NotificationsServices.markAsRead(notificationId.intValue());
    }

    @Override
    // Supprimer une notification
    public void deleteNotification(@PathVariable Long notificationId) {
        NotificationsServices.deleteNotification(notificationId);
    }
}
