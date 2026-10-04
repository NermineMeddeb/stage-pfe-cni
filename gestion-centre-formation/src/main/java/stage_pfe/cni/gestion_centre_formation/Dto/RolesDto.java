/* package stage_pfe.cni.gestion_centre_formation.Dto;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Builder;
import lombok.Data;
import stage_pfe.cni.gestion_centre_formation.Model.Roles;
@Data
@Builder
public class RolesDto {
    private Integer id;

    private String roleName;

    @JsonIgnore
    private UtilisateursDto utilisateur;

    public static RolesDto fromEntity(Roles roles) {
        if (roles == null) {
            return null;
        }
        return RolesDto.builder()
                .id(roles.getId())
                .roleName(roles.getRoleName())
                .build();
    }

    public static Roles toEntity(RolesDto dto) {
        if (dto == null) {
            return null;
        }
        Roles roles = new Roles();
        roles.setId(dto.getId());
        roles.setRoleName(dto.getRoleName());
        roles.setUtilisateur(UtilisateursDto.toEntity(dto.getUtilisateur()));
        return roles;
    }

}
 */