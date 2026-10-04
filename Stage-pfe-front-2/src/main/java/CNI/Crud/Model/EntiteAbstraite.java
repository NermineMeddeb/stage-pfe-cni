package CNI.Crud.Model;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.io.Serializable;
import java.time.LocalDate;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

// Utilise Lombok pour générer les getters, setters, toString, etc.
@Data

// Déclare cette classe comme une entité mappée qui peut être héritée par d'autres entités
@MappedSuperclass

// Ajoute des auditeurs pour remplir automatiquement les champs CreatedDate et LastModifiedDate
@EntityListeners(AuditingEntityListener.class)
public abstract class EntiteAbstraite implements Serializable {

    // Identifiant unique pour chaque entité, généré automatiquement
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;



}
