package CNI.Crud.Repository;

   import java.util.Optional;
 
  import org.springframework.data.jpa.repository.JpaRepository;

import CNI.Crud.Model.Salles;


 
  public interface SallesRepository extends JpaRepository<Salles, Long> {
  Optional<Salles> findById(Integer id);
  
  }
 