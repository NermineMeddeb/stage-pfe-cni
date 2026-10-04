package CNI.Crud.Utils;

public class Constants {
    public static final String APP_ROOT = "gestiondestock/v1";
    public static final String COMMANDE_FOURNISSEUR_ENDPOINT = APP_ROOT + "/commandesfournisseurs";
    public static final String CREATE_COMMANDE_FOURNISSEUR_ENDPOINT = COMMANDE_FOURNISSEUR_ENDPOINT + "/create";
    public static final String FIND_COMMANDE_FOURNISSEUR_BY_ID_ENDPOINT = COMMANDE_FOURNISSEUR_ENDPOINT + "/{idCommandeFournisseur}";
    public static final String FIND_COMMANDE_FOURNISSEUR_BY_CODE_ENDPOINT = COMMANDE_FOURNISSEUR_ENDPOINT + "/filter/{codeCommandeFournisseur}";
    public static final String FIND_ALL_COMMANDE_FOURNISSEUR_ENDPOINT = COMMANDE_FOURNISSEUR_ENDPOINT + "/all";
    public static final String DELETE_COMMANDE_FOURNISSEUR_ENDPOINT = COMMANDE_FOURNISSEUR_ENDPOINT + "/delete/{idCommandeFournisseur}";

    public static final String ENTREPRISE_ENDPOINT = APP_ROOT + "/entreprises";
    public static final String FOURNISSEUR_ENDPOINT = APP_ROOT + "/fournisseurs";
    public static final String UTILISATEUR_ENDPOINT = APP_ROOT + "/utilisateurs";
    public static final String VENTES_ENDPOINT = APP_ROOT + "/ventes";
    public static final String AUTHENTICATION_ENDPOINT = APP_ROOT + "/auth";
}
