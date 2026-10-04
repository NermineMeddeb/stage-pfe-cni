/* package stage_pfe.cni.gestion_centre_formation.Configuration;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
@Data
@ConfigurationProperties(prefix = "cors")
public class CorsConfig implements WebMvcConfigurer {
    private String allowedApi;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(allowedApi)
                .allowedMethods(CorsConfiguration.ALL);
    }
}

 */