/* package CNI.Crud.Repository;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import CNI.Crud.Model.FinancialData;

@Repository
public interface financialDataRepository extends JpaRepository<FinancialData, Long> {

    FinancialData findByDate(LocalDate date);

    List<FinancialData> findByDateBetween(LocalDate debut, LocalDate fin);

    List<FinancialData> findAllByOrderByDateDesc();
} */