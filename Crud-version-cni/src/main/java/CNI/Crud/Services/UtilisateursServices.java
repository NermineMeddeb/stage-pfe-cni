
package CNI.Crud.Services;

import java.util.List;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import CNI.Crud.Dto.ChangerMotDePasseUtilisateurDto;
import CNI.Crud.Dto.UtilisateursDto;

@Service

@Lazy

public interface UtilisateursServices {
  UtilisateursDto save(UtilisateursDto dto);

  UtilisateursDto updateUtilisateurs(UtilisateursDto dto);

  UtilisateursDto findById(Integer id);

  List<UtilisateursDto> findAll();

  void delete(Integer id);

  UtilisateursDto findByEmail(String email);

  UtilisateursDto changerMotDePasse(ChangerMotDePasseUtilisateurDto dto);

  List<UtilisateursDto> findEtudiants();

  List<UtilisateursDto> findFormateur();

  List<UtilisateursDto> findAdministrateurs();

  List<UtilisateursDto> findFormateurinterne();

  List<UtilisateursDto> findFormateurexterne();

  List<UtilisateursDto> findPersonnel_CNI();

  UtilisateursDto getUtilisateurByInscriptionId(Long inscriptionId);

}
