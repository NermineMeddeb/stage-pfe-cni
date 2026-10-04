package CNI.Crud.Repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import CNI.Crud.Model.Role;
import CNI.Crud.Model.Utilisateurs;

@Repository
public interface UtilisateursRepository extends JpaRepository<Utilisateurs, Integer> {

    // Recherche d'un utilisateur par son email
    Optional<Utilisateurs> findUtilisateurByEmail(String email);

    // Recherche des utilisateurs par un nom de rôle spécifique

    List<Utilisateurs> findByRole(Role role);

    /*
     * List<Utilisateurs> findByRole(@Param("role") Role role);
     */
    // Recherche des utilisateurs par une liste de rôles
    @Query("SELECT u FROM Utilisateurs u WHERE u.role IN :roleNames")
    List<Utilisateurs> findByRoleNames(@Param("roleNames") List<String> roleNames);

    @Modifying
    @Query(value = "DELETE FROM sessions_utilisateurs WHERE utilisateur_id = :id", nativeQuery = true)
    void deleteRelatedSessions(@Param("id") Integer id);

    @Modifying
    @Query(value = "DELETE FROM paiements WHERE utilisateur_id = :id", nativeQuery = true)
    void deleteRelatedPaiements(@Param("id") Integer id);

    @Query("SELECT i.utilisateur FROM Inscription i WHERE i.id = :inscriptionId")
    Utilisateurs findUtilisateurByInscriptionId(@Param("inscriptionId") Long inscriptionId);

    List<Utilisateurs> findByRoleIn(List<Role> roles);

    /*
     * int countByRoleInAndActiveTrue(List<Role> roles);
     */ int countByRoleIn(List<Role> roles);

}
