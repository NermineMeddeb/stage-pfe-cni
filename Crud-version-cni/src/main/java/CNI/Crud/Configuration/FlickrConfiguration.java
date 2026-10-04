/*package Mts.Crud.Configuration; // Assurez-vous que le package correspond à votre projet

// Importation des classes nécessaires
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.flickr4java.flickr.Flickr;
import com.flickr4java.flickr.REST;
import com.flickr4java.flickr.auth.AuthInterface;
import com.flickr4java.flickr.auth.Permission;
import com.flickr4java.flickr.auth.RequestContext;
import com.github.scribejava.core.builder.ServiceBuilder;
import com.github.scribejava.core.model.OAuth1RequestToken;
import com.github.scribejava.core.oauth.OAuth10aService;

/**
 * Classe de configuration pour l'intégration de Flickr dans le projet Spring Boot.
 * Elle permet de configurer et d'initialiser une instance de Flickr avec les clés API fournies.
 */
/*@Configuration
public class FlickrConfiguration {

    // Injection des valeurs des propriétés à partir du fichier de configuration (ex: application.properties)
    @Value("${flickr.apiKey}")
    private String apiKey; // Clé API pour l'accès à Flickr

    @Value("${flickr.apiSecret}")
    private String apiSecretKey; // Clé secrète API pour l'accès à Flickr

    /**
     * Crée et configure un bean Flickr avec les clés API et la configuration REST.
     *
     * @return Flickr - L'objet Flickr configuré pour interagir avec l'API de Flickr.
     */
   /*  @Bean
    public Flickr getFlickr() {
        // Création d'une nouvelle instance de Flickr avec les clés API et la configuration REST
        return new Flickr(apiKey, apiSecretKey, new REST());
    }

    /**
     * Exemple de configuration d'un service d'authentification OAuth pour Flickr.
     * Utilise les clés API pour construire le service OAuth.
     *
     * @return OAuth10aService - Service OAuth configuré pour gérer l'authentification.
     */
   /* @Bean
     public OAuth10aService flickrAuthService() {
        // Configuration du service d'authentification OAuth avec la clé API et la clé secrète
        return new ServiceBuilder(apiKey)
                .apiSecret(apiSecretKey)
                .build(Flickr.getOAuthProvider());
    }
}*/
