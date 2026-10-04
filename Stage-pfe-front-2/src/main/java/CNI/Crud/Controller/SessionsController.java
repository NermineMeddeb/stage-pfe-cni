
package CNI.Crud.Controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import CNI.Crud.Controller.Api.*;
import CNI.Crud.Dto.*;
import CNI.Crud.Services.*;
@CrossOrigin(origins = "http://localhost:4200") // Autorise l'origine Angular

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

            @RequestParam LocalDate startDate,

            @RequestParam LocalDate endDate) {
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
}
