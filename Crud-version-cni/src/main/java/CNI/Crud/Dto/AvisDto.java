package CNI.Crud.Dto;

import java.util.List;

import CNI.Crud.Model.Avis;
import CNI.Crud.Model.Sessions;
import CNI.Crud.Model.Utilisateurs;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AvisDto {

    private Long id;
    private Long sessionsId;
    private Long utilisateursId;
    private String dateFormation;
    private String lieuFormation;
    // Liste d'IDs des formateurs
    private List<Long> formateurIds;
    private Integer evaluationFormateur;
    private Integer evaluationEnvironnement;
    private Integer evaluationMoyens;
    private Integer evaluationFormation;
    private Integer noteGlobale;
    private Boolean nouveauxBesoinFormation;
    private String besoinsFormation;
    private String responsableNom;
    private String responsableTel;
    private String responsableEmail;
    private String suggestions;

    // Conversion entité -> DTO
    public static AvisDto fromEntity(Avis avis) {
        if (avis == null)
            return null;

        return AvisDto.builder()
                .id(avis.getId())
                .sessionsId(avis.getSessions() != null ? Long.valueOf(avis.getSessions().getId()) : null)
                .utilisateursId(avis.getUtilisateurs() != null ? Long.valueOf(avis.getUtilisateurs().getId()) : null)
                .dateFormation(avis.getDateFormation() != null ? avis.getDateFormation().toString() : null)
                .lieuFormation(avis.getLieuFormation())
                .formateurIds(avis.getFormateurs() != null
                        ? avis.getFormateurs().stream().map(u -> Long.valueOf(u.getId())).toList()
                        : null)
                .evaluationFormateur(avis.getEvaluationFormateur())
                .evaluationEnvironnement(avis.getEvaluationEnvironnement())
                .evaluationMoyens(avis.getEvaluationMoyens())
                .evaluationFormation(avis.getEvaluationFormation())
                .noteGlobale(avis.getNoteGlobale())
                .nouveauxBesoinFormation(avis.getNouveauxBesoinFormation())
                .besoinsFormation(avis.getBesoinsFormation())
                .responsableNom(avis.getResponsableNom())
                .responsableTel(avis.getResponsableTel())
                .responsableEmail(avis.getResponsableEmail())
                .suggestions(avis.getSuggestions())

                .build();
    }

    // Conversion DTO -> entité
    public static Avis toEntity(AvisDto dto) {
        if (dto == null)
            return null;
        Avis avis = new Avis();
        avis.setId(dto.getId());
        if (dto.getSessionsId() != null) {
            Sessions session = new Sessions();
            session.setId(dto.getSessionsId().intValue());
            avis.setSessions(session);
        }
        if (dto.getUtilisateursId() != null) {
            Utilisateurs utilisateur = new Utilisateurs();
            utilisateur.setId(dto.getUtilisateursId().intValue());
            avis.setUtilisateurs(utilisateur);
        }
        if (dto.getDateFormation() != null) {
            avis.setDateFormation(java.sql.Date.valueOf(dto.getDateFormation()));
        }
        avis.setLieuFormation(dto.getLieuFormation());

        if (dto.getFormateurIds() != null) {
            List<Utilisateurs> formateurs = dto.getFormateurIds().stream().map(id -> {
                Utilisateurs u = new Utilisateurs();
                u.setId(id.intValue());
                return u;
            }).toList();
            avis.setFormateurs(formateurs);
        }
        avis.setEvaluationFormateur(dto.getEvaluationFormateur());
        avis.setEvaluationEnvironnement(dto.getEvaluationEnvironnement());
        avis.setEvaluationMoyens(dto.getEvaluationMoyens());
        avis.setEvaluationFormation(dto.getEvaluationFormation());
        avis.setNoteGlobale(dto.getNoteGlobale());
        avis.setNouveauxBesoinFormation(dto.getNouveauxBesoinFormation());
        avis.setBesoinsFormation(dto.getBesoinsFormation());
        avis.setResponsableNom(dto.getResponsableNom());
        avis.setResponsableTel(dto.getResponsableTel());
        avis.setResponsableEmail(dto.getResponsableEmail());
        avis.setSuggestions(dto.getSuggestions());

        return avis;
    }
}
