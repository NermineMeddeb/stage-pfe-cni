package stage_pfe.cni.gestion_centre_formation.Model;

import java.util.List;
import lombok.*;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "formations")
public class Formations extends EntiteAbstraite {

    @NotEmpty(message = "Le titre est obligatoire.")
    @Size(max = 255, message = "Le titre ne doit pas dépasser 255 caractères.")
    private String titre;

    @NotEmpty(message = "La description est obligatoire.")
    @Column(columnDefinition = "TEXT")
    private String description;

    @NotEmpty(message = "La description est obligatoire.")
    private String photo;

    @NotNull(message = "La durée est obligatoire.")
    private Integer duree;

    @NotNull(message = "Le prix est obligatoire.")
    private Double prix;

    @NotEmpty(message = "Le niveau est obligatoire.")
    private String niveau;

    @Column(columnDefinition = "TEXT")
    private String prerequis;

    @NotEmpty(message = "Le statut est obligatoire.")
    private String statut;

    @NotNull(message = "Le nombre maximum de places est obligatoire.")
    private Integer placesMax;

    @Column(columnDefinition = "TEXT")
    private String objectifsFormation;

    @Column(columnDefinition = "TEXT")
    private String programmeDetaille;
  /*   @OneToMany(mappedBy = "formation", fetch = FetchType.LAZY)
    private List<Sessions> sessions; */

    // Relation avec Themes
 /*    @ManyToOne
    @JoinColumn(name = "theme_id", nullable = false, foreignKey = @ForeignKey(name = "FK_formation_theme"))
    private Themes theme; */

}
