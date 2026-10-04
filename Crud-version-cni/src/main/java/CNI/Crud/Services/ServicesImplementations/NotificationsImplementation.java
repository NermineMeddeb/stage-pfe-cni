package CNI.Crud.Services.ServicesImplementations;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import CNI.Crud.Dto.NotificationsDto;
import CNI.Crud.Model.Notifications;
import CNI.Crud.Model.Utilisateurs;
import CNI.Crud.Repository.NotificationsRepository;
import CNI.Crud.Repository.UtilisateursRepository;
import CNI.Crud.Services.NotificationsServices;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import javax.management.Notification;

@Service
@RequiredArgsConstructor
public class NotificationsImplementation implements NotificationsServices {

    private final NotificationsRepository notificationsRepository;
    private final UtilisateursRepository utilisateursRepository; // Pour récupérer l'utilisateur
    private final JavaMailSender mailSender;

    @Override
    public NotificationsDto sendNotification(NotificationsDto notificationsDto) {
        if (notificationsDto == null || notificationsDto.getUtilisateurId() == null) {
            throw new IllegalArgumentException("NotificationsDto ou utilisateurId ne peut pas être nul");
        }

        Utilisateurs utilisateur = utilisateursRepository.findById(notificationsDto.getUtilisateurId())
                .orElseThrow(() -> new RuntimeException(
                        "Utilisateur non trouvé avec ID : " + notificationsDto.getUtilisateurId()));

        Notifications notification = NotificationsDto.toEntity(notificationsDto, utilisateur);
        notification.setDateEnvoi(LocalDateTime.now()); // Date d'envoi automatique

        Notifications savedNotification = notificationsRepository.save(notification);

        return NotificationsDto.fromEntity(savedNotification);
    }

    @Override
    public void sendEmail(String destinataire, String sujet, String contenu) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(destinataire);
            helper.setSubject(sujet);
            helper.setText(contenu, true); // true pour contenu HTML

            mailSender.send(message);

            System.out.println("✅ Email envoyé à : " + destinataire);

        } catch (MessagingException e) {
            System.err.println("❌ Erreur lors de l'envoi de l'email : " + e.getMessage());
            throw new RuntimeException("Erreur lors de l'envoi d'email", e);
        }
    }

    public List<Notifications> getNotificationsByUser(Utilisateurs utilisateur) {
        return notificationsRepository.findByUtilisateur(utilisateur);
    }

    public Notifications createNotification(Notifications notification) {
        notification.setDateCreation(LocalDateTime.now());
        return notificationsRepository.save(notification);
    }

    public Optional<Notifications> markAsRead(Integer notificationId) {
        Optional<Notifications> notification = notificationsRepository.findById(notificationId);
        notification.ifPresent(n -> {
            n.setEstLue(true);
            notificationsRepository.save(n);
        });
        return notification;
    }

    public void deleteNotification(Long notificationId) {
        notificationsRepository.deleteById(notificationId.intValue());
    }
}
