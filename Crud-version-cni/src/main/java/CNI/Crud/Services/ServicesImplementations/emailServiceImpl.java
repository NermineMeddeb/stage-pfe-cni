package CNI.Crud.Services.ServicesImplementations;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import CNI.Crud.Model.email;
import CNI.Crud.Services.emailService;

import java.io.File;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class emailServiceImpl implements emailService {

    private final JavaMailSender javaMailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String expediteur;

    @Override
    public String envoyerEmail(email emailDetails) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();

            // Configuration de l'email
            mailMessage.setFrom(expediteur);
            mailMessage.setTo(emailDetails.getDestinataire());

            // Ajout des destinataires en copie si présents
            if (emailDetails.getDestinatairesCc() != null && !emailDetails.getDestinatairesCc().isEmpty()) {
                mailMessage.setCc(emailDetails.getDestinatairesCc().toArray(new String[0]));
            }

            // Ajout des destinataires en copie cachée si présents
            if (emailDetails.getDestinatairesBcc() != null && !emailDetails.getDestinatairesBcc().isEmpty()) {
                mailMessage.setBcc(emailDetails.getDestinatairesBcc().toArray(new String[0]));
            }

            mailMessage.setSubject(emailDetails.getSujet());
            mailMessage.setText(emailDetails.getContenu());

            // Envoi de l'email
            javaMailSender.send(mailMessage);
            log.info("Email envoyé avec succès à {}", emailDetails.getDestinataire());
            return "Email envoyé avec succès";
        } catch (Exception e) {
            log.error("Erreur lors de l'envoi de l'email : {}", e.getMessage());
            return "Erreur lors de l'envoi de l'email : " + e.getMessage();
        }
    }

    @Override
    public String envoyerEmailAvecPieceJointe(email emailDetails) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);

            // Configuration de l'email
            mimeMessageHelper.setFrom(expediteur);
            mimeMessageHelper.setTo(emailDetails.getDestinataire());

            // Ajout des destinataires en copie si présents
            if (emailDetails.getDestinatairesCc() != null && !emailDetails.getDestinatairesCc().isEmpty()) {
                mimeMessageHelper.setCc(emailDetails.getDestinatairesCc().toArray(new String[0]));
            }

            // Ajout des destinataires en copie cachée si présents
            if (emailDetails.getDestinatairesBcc() != null && !emailDetails.getDestinatairesBcc().isEmpty()) {
                mimeMessageHelper.setBcc(emailDetails.getDestinatairesBcc().toArray(new String[0]));
            }

            mimeMessageHelper.setSubject(emailDetails.getSujet());
            mimeMessageHelper.setText(emailDetails.getContenu(), emailDetails.isEstHtml());

            // Ajout des pièces jointes
            if (emailDetails.getPieceJointe() != null && !emailDetails.getPieceJointe().isEmpty()) {
                for (String cheminFichier : emailDetails.getPieceJointe()) {
                    FileSystemResource file = new FileSystemResource(new File(cheminFichier));
                    mimeMessageHelper.addAttachment(Objects.requireNonNull(file.getFilename()), file);
                }
            }

            // Envoi de l'email
            javaMailSender.send(mimeMessage);
            log.info("Email avec pièce jointe envoyé avec succès à {}", emailDetails.getDestinataire());
            return "Email avec pièce jointe envoyé avec succès";
        } catch (MessagingException e) {
            log.error("Erreur lors de l'envoi de l'email avec pièce jointe : {}", e.getMessage());
            return "Erreur lors de l'envoi de l'email avec pièce jointe : " + e.getMessage();
        }
    }

    @Override
    public String envoyerEmailAvecTemplate(email emailDetails, String templateName, Object variables) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            // Configuration de l'email
            mimeMessageHelper.setFrom(expediteur);
            mimeMessageHelper.setTo(emailDetails.getDestinataire());

            // Ajout des destinataires en copie si présents
            if (emailDetails.getDestinatairesCc() != null && !emailDetails.getDestinatairesCc().isEmpty()) {
                mimeMessageHelper.setCc(emailDetails.getDestinatairesCc().toArray(new String[0]));
            }

            // Ajout des destinataires en copie cachée si présents
            if (emailDetails.getDestinatairesBcc() != null && !emailDetails.getDestinatairesBcc().isEmpty()) {
                mimeMessageHelper.setBcc(emailDetails.getDestinatairesBcc().toArray(new String[0]));
            }

            mimeMessageHelper.setSubject(emailDetails.getSujet());

            // Traitement du template
            Context context = new Context();
            if (variables instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> variablesMap = (Map<String, Object>) variables;
                context.setVariables(variablesMap);
            }

            String contenu = templateEngine.process(templateName, context);
            mimeMessageHelper.setText(contenu, true);

            // Ajout des pièces jointes
            if (emailDetails.getPieceJointe() != null && !emailDetails.getPieceJointe().isEmpty()) {
                for (String cheminFichier : emailDetails.getPieceJointe()) {
                    FileSystemResource file = new FileSystemResource(new File(cheminFichier));
                    mimeMessageHelper.addAttachment(Objects.requireNonNull(file.getFilename()), file);
                }
            }

            // Envoi de l'email
            javaMailSender.send(mimeMessage);
            log.info("Email avec template envoyé avec succès à {}", emailDetails.getDestinataire());
            return "Email avec template envoyé avec succès";
        } catch (MessagingException e) {
            log.error("Erreur lors de l'envoi de l'email avec template : {}", e.getMessage());
            return "Erreur lors de l'envoi de l'email avec template : " + e.getMessage();
        }
    }
}