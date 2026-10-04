package stage_pfe.cni.gestion_centre_formation.Utils;

public class Constants {

        // Racine commune pour les endpoints
        public static final String APP_ROOT = "gestioncentreformation/CNI";
    
        // Endpoints pour les thèmes
        public static final String THEMES_ENDPOINT = APP_ROOT + "/themes";
        public static final String CREATE_THEME_ENDPOINT = THEMES_ENDPOINT + "/create";
        public static final String FIND_THEME_BY_ID_ENDPOINT = THEMES_ENDPOINT + "/{idTheme}";
        public static final String FIND_THEME_BY_NAME_ENDPOINT = THEMES_ENDPOINT + "/filter/{nomTheme}";
        public static final String FIND_ALL_THEMES_ENDPOINT = THEMES_ENDPOINT + "/all";
        public static final String DELETE_THEME_ENDPOINT = THEMES_ENDPOINT + "/delete/{idTheme}";
    
        // Endpoints pour les formations
        public static final String FORMATIONS_ENDPOINT = APP_ROOT + "/formations";
        public static final String CREATE_FORMATION_ENDPOINT = FORMATIONS_ENDPOINT + "/create";
        public static final String FIND_FORMATION_BY_ID_ENDPOINT = FORMATIONS_ENDPOINT + "/{idFormation}";
        public static final String FIND_FORMATION_BY_THEME_ENDPOINT = FORMATIONS_ENDPOINT + "/theme/{idTheme}";
        public static final String FIND_ALL_FORMATIONS_ENDPOINT = FORMATIONS_ENDPOINT + "/all";
        public static final String DELETE_FORMATION_ENDPOINT = FORMATIONS_ENDPOINT + "/delete/{idFormation}";
    
        // Endpoints pour les utilisateurs
        public static final String UTILISATEURS_ENDPOINT= APP_ROOT + "/utilisateurs";
        public static final String CREATE_UTILISATEUR_ENDPOINT = UTILISATEURS_ENDPOINT + "/create";
        public static final String FIND_UTILISATEUR_BY_ID_ENDPOINT = UTILISATEURS_ENDPOINT + "/{idUtilisateur}";
        public static final String FIND_ALL_UTILISATEURS_ENDPOINT = UTILISATEURS_ENDPOINT + "/all";
        public static final String DELETE_UTILISATEUR_ENDPOINT = UTILISATEURS_ENDPOINT + "/delete/{idUtilisateur}";
    
        // Endpoints pour l'authentification
        public static final String AUTHENTICATION_ENDPOINT = APP_ROOT + "/auth";
        public static final String LOGIN_ENDPOINT = AUTHENTICATION_ENDPOINT + "/login";
        public static final String REFRESH_TOKEN_ENDPOINT = AUTHENTICATION_ENDPOINT + "/refresh";
    
        // Endpoints pour d'autres entités ou opérations spécifiques
        public static final String ENTREPRISES_ENDPOINT = APP_ROOT + "/entreprises";
        public static final String ADMINISTRATEURS_ENDPOINT = APP_ROOT + "/administrateurs";
    
        // Ajouter d'autres endpoints si nécessaire
    }
    

