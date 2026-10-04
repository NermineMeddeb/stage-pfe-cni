package CNI.Crud.Configuration;

// Importation des classes nécessaires
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info; // Assurez-vous d'importer cette classe pour définir les informations de l'API

/**
 * Classe de configuration pour la documentation OpenAPI dans le projet Spring Boot.
 * Cette classe permet de configurer les groupes d'API et les informations de l'API pour la documentation.
 */
@Configuration
public class OpenAPIConfig {

    /**
     * Crée un bean GroupedOpenApi pour regrouper toutes les routes de l'application sous un groupe nommé "public".
     * 
     * @return GroupedOpenApi - Configuration pour inclure toutes les routes dans la documentation.
     */
    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
            .group("public") // Le nom du groupe de routes dans la documentation
            .pathsToMatch("/**") // Inclut toutes les routes dans ce groupe
            .build();
    }

    /**
     * Crée un bean OpenAPI pour configurer les informations générales sur l'API.
     * 
     * @return OpenAPI - Configuration des métadonnées de l'API, y compris le titre, la version et la description.
     */
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Gestion de centre de formations au sein CNI") // Titre de l'API affiché dans la documentation
                .version("1.0") // Version de l'API
                .description("Documentation de l'API REST pour l'application de gestion de centre de formations au sein CNI.")); // Description de l'API
    }
}
