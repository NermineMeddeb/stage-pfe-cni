package CNI.Crud.Model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "certificats")
public class Certificats extends EntiteAbstraite {

    @ManyToOne

    @JoinColumn(name = "inscription_id", nullable = false)
    private Inscription inscription;

    @Column(name = "date_generation", nullable = false)
    private LocalDate dateGeneration;

    @Column(name = "statut", nullable = false)
    private String statut;
    @Column(name = "numeroSerie", nullable = false)

    private String numeroSerie;

    @Column(name = "file_url", nullable = false)
    private String file_url;

}
