package CNI.Crud.Repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import CNI.Crud.Model.Utilisateurs;

@Repository
public interface UtilisateursRepository extends JpaRepository<CNI.Crud.Model.Utilisateurs, Integer> {
    Optional<Utilisateurs> findUtilisateurByEmail(String email);

    @Query("SELECT u FROM Utilisateurs u JOIN u.roles r WHERE r.roleName = :roleName")
    List<Utilisateurs> findByRole(@Param("roleName") String roleName);
}
