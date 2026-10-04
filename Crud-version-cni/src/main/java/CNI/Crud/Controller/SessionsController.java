
package CNI.Crud.Controller;

import java.time.LocalDate;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import CNI.Crud.Controller.Api.*;
import CNI.Crud.Dto.*;
import CNI.Crud.Model.Sessions;
import CNI.Crud.Model.Utilisateurs;
import CNI.Crud.Services.*;

@CrossOrigin(origins = "http://localhost:4200")

@RestController
public class SessionsController implements SessionsApi {

    private final SessionsServices sessionsServices;

    @Autowired
    public SessionsController(SessionsServices sessionsServices) {
        this.sessionsServices = sessionsServices;
    }

    @Override
    public SessionsDto save(SessionsDto dto) {
        return sessionsServices.save(dto);
    }

    @Override
    public SessionsDto updatesessions(SessionsDto dto) {
        return sessionsServices.updatesessions(dto);
    }

    @Override
    public SessionsDto findById(@PathVariable Long id) {
        return sessionsServices.findById(id);
    }

    @Override
    public List<SessionsDto> findAll() {
        return sessionsServices.findAll();
    }

    @Override
    public List<SessionsDto> findByFormation(@PathVariable Long formationId) {
        return sessionsServices.findByFormation(formationId);
    }

    @Override
    public List<SessionsDto> findByDateBetween(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        return sessionsServices.findByDateBetween(startDate, endDate);
    }

    @Override
    public List<SessionsDto> findUpcomingSessions() {
        return sessionsServices.findUpcomingSessions();
    }

    @Override
    public Integer getAvailablePlaces(@PathVariable Long sessionId) {
        return sessionsServices.getAvailablePlaces(sessionId);
    }

    @Override
    public void delete(@PathVariable Long id) {
        sessionsServices.delete(id);
    }

    /*
     * @Override
     * 
     * public Utilisateurs getFormateur(@PathVariable Long sessionId,
     * 
     * @RequestParam String roleName) {
     * return sessionsServices.getFormateurBySessionIdAndRole(sessionId, roleName);
     * }
     */ @Override
    public List<Utilisateurs> getParticipants(@PathVariable Long sessionId) {
        return sessionsServices.getParticipants(sessionId);
    }

    @Override
    public List<Utilisateurs> getStudentParticipants(Long sessionId) {
        return sessionsServices.getStudentParticipants(sessionId);
    }

    @Override
    public List<Utilisateurs> getFormateur(Long sessionId) {
        return sessionsServices.getFormateur(sessionId);
    }

    @Override
    public List<SessionsDto> findByFormateur(@PathVariable Long formateurId) {
        return sessionsServices.findSessionsByFormateur(formateurId);
    }

    @Override
    public List<SessionsDto> findAvailableSessionsByFormationId(@PathVariable Long formationId) {
        return sessionsServices.findAvailableSessionsByFormationId(formationId);
    }

    @Override
      public SessionsDto addUserToSession(@PathVariable Long sessionId, @PathVariable Long utilisateurId) {
        return sessionsServices.addUserToSession(sessionId, utilisateurId);}

}
