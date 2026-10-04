
package CNI.Crud.Services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;

import CNI.Crud.Dto.SessionsDto;
import CNI.Crud.Model.Sessions;
import CNI.Crud.Model.Utilisateurs;

public interface SessionsServices {
  SessionsDto save(SessionsDto dto);

  SessionsDto updatesessions(SessionsDto dto);

  SessionsDto findById(Long id);

  List<SessionsDto> findAll();

  List<SessionsDto> findByFormation(Long formationId);

  List<SessionsDto> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate);

  void delete(Long id);

  List<SessionsDto> findUpcomingSessions();

  Integer getAvailablePlaces(Long sessionId);

  public List<Utilisateurs> getParticipants(@PathVariable Long sessionId);

  public List<Utilisateurs> getStudentParticipants(@PathVariable Long sessionId);

  public List<Utilisateurs> getFormateur(@PathVariable Long sessionId);

  public List<SessionsDto> findSessionsByFormateur(Long formateurId);

  public List<SessionsDto> findAvailableSessionsByFormationId(Long formationId);

  public SessionsDto addUserToSession(Long sessionId, Long utilisateurId) ;


}
