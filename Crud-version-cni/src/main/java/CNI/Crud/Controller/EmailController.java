package CNI.Crud.Controller;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import CNI.Crud.Model.email;

import java.util.Map;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailController {

    private final CNI.Crud.Services.emailService emailService;

    @PostMapping("/envoyer")
    public ResponseEntity<String> envoyerEmail(@RequestBody email emailDetails) {
        String statut = emailService.envoyerEmail(emailDetails);
        return ResponseEntity.ok(statut);
    }

    @PostMapping("/envoyer-avec-piece-jointe")
    public ResponseEntity<String> envoyerEmailAvecPieceJointe(@RequestBody email emailDetails) {
        String statut = emailService.envoyerEmailAvecPieceJointe(emailDetails);
        return ResponseEntity.ok(statut);
    }

    @PostMapping("/envoyer-avec-template/{templateName}")
    public ResponseEntity<String> envoyerEmailAvecTemplate(
            @RequestBody email emailDetails,
            @PathVariable String templateName,
            @RequestParam Map<String, Object> variables) {
        String statut = emailService.envoyerEmailAvecTemplate(emailDetails, templateName, variables);
        return ResponseEntity.ok(statut);
    }
}