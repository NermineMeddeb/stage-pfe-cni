/* package stage_pfe.cni.gestion_centre_formation.Configuration;

// Importation des classes nécessaires
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.flickr4java.flickr.Flickr;
import com.flickr4java.flickr.REST;
import com.github.scribejava.core.builder.ServiceBuilder;
import com.github.scribejava.core.oauth.OAuth10aService;

@Configuration
public class FlickrConfiguration {

    // Injection des valeurs des propriétés à partir du fichier de configuration (ex: application.properties)
    @Value("${flickr.apiKey}")
    private String apiKey; // Clé API pour l'accès à Flickr

    @Value("${flickr.apiSecret}")
    private String apiSecretKey; // Clé secrète API pour l'accès à Flickr

    // Bean Flickr permettant d'interagir avec l'API
    @Bean
    public Flickr getFlickr() {
        // Création d'une nouvelle instance de Flickr avec les clés API et la configuration REST
        return new Flickr(apiKey, apiSecretKey, new REST());
    }

    // Service d'authentification OAuth pour interagir avec Flickr via OAuth1
    @Bean
    public OAuth10aService flickrAuthService() {
        // Configuration du service d'authentification OAuth avec la clé API et la clé secrète
        return new ServiceBuilder(apiKey)
                .apiSecret(apiSecretKey)
                .build(Flickr.getOAuthProvider());
    } 
}
 */