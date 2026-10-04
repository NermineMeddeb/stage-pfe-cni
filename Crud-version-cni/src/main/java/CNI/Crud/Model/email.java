package CNI.Crud.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "email")
public class email extends EntiteAbstraite {

    private String destinataire;
    private List<String> destinatairesCc;
    private List<String> destinatairesBcc;
    private String sujet;
    private String contenu;
    private boolean estHtml;
    private List<String> pieceJointe;

}
