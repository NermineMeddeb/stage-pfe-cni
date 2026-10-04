package CNI.Crud.Model;

import java.sql.Date;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Avis")
public class Avis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sessions_id", nullable = false)
    private Sessions sessions;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateurs utilisateurs;
    private Date dateFormation;
    private String lieuFormation;
    @ManyToMany
    @JoinTable(name = "avis_formateurs", joinColumns = @JoinColumn(name = "avis_id"), inverseJoinColumns = @JoinColumn(name = "formateur_id"))
    private List<Utilisateurs> formateurs;

    private Integer evaluationFormateur;
    private Integer evaluationEnvironnement;
    private Integer evaluationMoyens;
    private Integer evaluationFormation;
    private Integer noteGlobale;

    private Boolean nouveauxBesoinFormation;
    private String besoinsFormation;
    @Column(nullable = true)
    private String responsableNom;
    @Column(nullable = true)

    private String responsableTel;
    @Column(nullable = true)

    private String responsableEmail;

    @Lob
    @Column(nullable = true)

    private String suggestions;
    private String varatester;

}
