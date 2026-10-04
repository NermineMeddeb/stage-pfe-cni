/*  package CNI.Crud.Model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "financial_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancialData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    private Double chiffreAffaire;

    private Double coutFormateur;

    private Double coutEmploye;

    private Integer nombreClients;

    private Integer nombreFormations;

    private Integer nombreEmployes;

    private Integer nombreHeuresFormation;

  
    public Double getProfit() {
        if (chiffreAffaire == null)
            return null;

        double totalCosts = 0;
        if (coutFormateur != null)
            totalCosts += coutFormateur;
        if (coutEmploye != null)
            totalCosts += coutEmploye;

        return chiffreAffaire - totalCosts;
    }
}
  */