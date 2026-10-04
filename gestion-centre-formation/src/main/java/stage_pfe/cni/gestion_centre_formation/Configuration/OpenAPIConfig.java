/* package stage_pfe.cni.gestion_centre_formation.Configuration;

// Importation des classes nécessaires
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info; // Assurez-vous d'importer cette classe pour définir les informations de l'API


@Configuration
public class OpenAPIConfig {

    
     @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
            .group("public") // Le nom du groupe de routes dans la documentation
            .pathsToMatch("/**") // Inclut toutes les routes dans ce groupe
            .build();
    }

 
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Gestion de  centre de formation") // Titre de l'API affiché dans la documentation
                .version("1.0") // Version de l'API
                .description("Documentation de l'API REST pour l'application Gestion de  centre de formation.")); // Description de l'API
    }
}
 */