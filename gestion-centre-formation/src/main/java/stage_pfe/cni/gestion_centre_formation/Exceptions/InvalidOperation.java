package stage_pfe.cni.gestion_centre_formation.Exceptions;


    import lombok.Getter;
    
    // Déclaration de la classe InvalidOperation qui hérite de RuntimeException
public class InvalidOperation extends RuntimeException {

  // Champ pour stocker le code d'erreur, avec un getter généré automatiquement par Lombok
  @Getter
  private ErrorCodes errorCode;

  // Constructeur qui prend un message en paramètre
  public InvalidOperation(String message) {
    super(message); // Appelle le constructeur de la classe parent (RuntimeException) avec le message
  }

  // Constructeur qui prend un message et une cause (une autre exception) en paramètre
  public InvalidOperation(String message, Throwable cause) {
    super(message, cause); // Appelle le constructeur de la classe parent avec le message et la cause
  }

  // Constructeur qui prend un message, une cause et un code d'erreur en paramètre
  public InvalidOperation(String message, Throwable cause, ErrorCodes errorCode) {
    super(message, cause); // Appelle le constructeur de la classe parent avec le message et la cause
    this.errorCode = errorCode; // Initialise le champ errorCode avec le code d'erreur fourni
  }

  // Constructeur qui prend un message et un code d'erreur en paramètre
  public InvalidOperation(String message, ErrorCodes errorCode) {
    super(message); // Appelle le constructeur de la classe parent avec le message
    this.errorCode = errorCode; // Initialise le champ errorCode avec le code d'erreur fourni
  }
}