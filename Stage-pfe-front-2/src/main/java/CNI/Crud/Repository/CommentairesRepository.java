package CNI.Crud.Repository;

import CNI.Crud.Model.Commentaires;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentairesRepository extends JpaRepository<Commentaires, Integer> {
    // Vous pouvez ajouter des méthodes personnalisées ici si nécessaire, comme :
    // List<Commentaires> findByUtilisateurId(Integer utilisateurId);
    // List<Commentaires> findByFormationId(Integer formationId);
}
