package CNI.Crud.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "sessions")
public class Sessions extends EntiteAbstraite {

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "formation_id", nullable = false)
    private Formations formation;

    @ManyToMany
    @JoinTable(name = "sessions_utilisateurs", joinColumns = @JoinColumn(name = "session_id"), inverseJoinColumns = @JoinColumn(name = "utilisateur_id"))
    private List<Utilisateurs> utilisateurs;

    @ManyToOne
    @JoinColumn(name = "salle_id", nullable = false)
    private Salles salle;

    @Column(name = "date_debut", nullable = false)
    private LocalDateTime dateDebut;

    @Column(name = "date_fin", nullable = false)
    private LocalDateTime dateFin;

    @Column(name = "capacite", nullable = false)
    private Integer capacite;

    @Column(name = "places_disponibles", nullable = false)
    private Integer placesDisponibles;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Inscription> inscriptions;

}
