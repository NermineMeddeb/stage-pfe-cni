package stage_pfe.cni.gestion_centre_formation.Gestionnaires;
/*package Mts.Crud.Gestionnaires;

    

// Importation des classes nécessaires

import Mts.Crud.Exceptions.EntityNotFound;
import Mts.Crud.Exceptions.InvalidEntity;
import Mts.Crud.Exceptions.InvalidOperation;
import java.util.Collections;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

// @RestControllerAdvice indique que cette classe fournit des conseils globaux pour les contrôleurs REST
@RestControllerAdvice
public class ResetException extends ResponseEntityExceptionHandler {

  // Gère les exceptions de type EntityNotFoundException
  @ExceptionHandler(EntityNotFound.class)
  public ResponseEntity<ErrorsDto> handleException(EntityNotFound exception, WebRequest webRequest) {

    // Statut HTTP 404 (Non trouvé)
    final HttpStatus notFound = HttpStatus.NOT_FOUND;

    // Crée un objet ErrorDto avec les informations d'erreur
    final ErrorsDto errorDto = ErrorsDto.builder()
        .code(exception.getErrorCode()) // Code d'erreur spécifique
        .httpCode(notFound.value()) // Code HTTP
        .message(exception.getMessage()) // Message d'erreur
        .build();

    // Retourne une réponse HTTP avec le statut 404 et le corps contenant ErrorDto
    return new ResponseEntity<>(errorDto, notFound);
  }

  // Gère les exceptions de type InvalidOperationException
  @ExceptionHandler(InvalidOperation.class)
  public ResponseEntity<ErrorsDto> handleException(InvalidOperation exception, WebRequest webRequest) {

    // Statut HTTP 400 (Mauvaise requête)
    final HttpStatus notFound = HttpStatus.BAD_REQUEST;

    // Crée un objet ErrorDto avec les informations d'erreur
    final ErrorsDto errorDto = ErrorsDto.builder()
        .code(exception.getErrorCode()) // Code d'erreur spécifique
        .httpCode(notFound.value()) // Code HTTP
        .message(exception.getMessage()) // Message d'erreur
        .build();

    // Retourne une réponse HTTP avec le statut 400 et le corps contenant ErrorDto
    return new ResponseEntity<>(errorDto, notFound);
  }

  // Gère les exceptions de type InvalidEntityException
  @ExceptionHandler(InvalidEntity.class)
  public ResponseEntity<ErrorsDto> handleException(InvalidEntity exception, WebRequest webRequest) {
    // Statut HTTP 400 (Mauvaise requête)
    final HttpStatus badRequest = HttpStatus.BAD_REQUEST;

    // Crée un objet ErrorDto avec les informations d'erreur, y compris la liste des erreurs spécifiques
    final ErrorsDto errorDto = ErrorsDto.builder()
        .code(exception.getErrorCode()) // Code d'erreur spécifique
        .httpCode(badRequest.value()) // Code HTTP
        .message(exception.getMessage()) // Message d'erreur
        .errors(exception.getErrors()) // Liste des messages d'erreur supplémentaires
        .build();

    // Retourne une réponse HTTP avec le statut 400 et le corps contenant ErrorDto
    return new ResponseEntity<>(errorDto, badRequest);
  }

  // Gère les exceptions de type BadCredentialsException
  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<ErrorsDto> handleException(BadCredentialsException exception, WebRequest webRequest) {
    // Statut HTTP 400 (Mauvaise requête)
    final HttpStatus badRequest = HttpStatus.BAD_REQUEST;

    // Crée un objet ErrorDto avec les informations d'erreur, y compris un message d'erreur spécifique
    final ErrorsDto errorDto = ErrorsDto.builder()
        .code(ErrorCodes.BAD_CREDENTIALS) // Code d'erreur spécifique
        .httpCode(badRequest.value()) // Code HTTP
        .message(exception.getMessage()) // Message d'erreur
        .errors(Collections.singletonList("Login et / ou mot de passe incorrecte")) // Liste contenant un message d'erreur spécifique
        .build();

    // Retourne une réponse HTTP avec le statut 400 et le corps contenant ErrorDto
    return new ResponseEntity<>(errorDto, badRequest);
  }
}

*/