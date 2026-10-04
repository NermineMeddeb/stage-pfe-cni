/* package stage_pfe.cni.gestion_centre_formation.Services;

import java.time.LocalDate;
import java.util.List;
import stage_pfe.cni.gestion_centre_formation.Dto.SessionsDto;

public interface SessionsServices {
     SessionsDto save(SessionsDto dto);

    SessionsDto findById(Long id);

    List<SessionsDto> findAll();

    List<SessionsDto> findByFormation(Long formationId);

    // List<SessionsDto> findByFormateur(Long formateurId);

    List<SessionsDto> findByDateBetween(LocalDate startDate, LocalDate endDate);

    // boolean checkRoomAvailability(Long salleId, LocalDate startDate, LocalDate
    // endDate);

    void delete(Long id);

    List<SessionsDto> findUpcomingSessions();

    Integer getAvailablePlaces(Long sessionId);
}
 */