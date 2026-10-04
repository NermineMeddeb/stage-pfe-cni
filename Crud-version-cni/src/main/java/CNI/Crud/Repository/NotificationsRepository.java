package CNI.Crud.Repository;

import java.util.List;

import javax.management.Notification;

import org.springframework.data.jpa.repository.JpaRepository;

import CNI.Crud.Model.Notifications;
import CNI.Crud.Model.Utilisateurs;

public interface NotificationsRepository extends JpaRepository<Notifications, Integer> {
    List<Notifications> findByUtilisateur(Utilisateurs utilisateur);

    void deleteByUtilisateurId(long utilisateurId);

}
