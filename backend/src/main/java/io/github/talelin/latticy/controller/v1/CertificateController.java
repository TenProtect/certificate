package io.github.talelin.latticy.controller.v1;

import io.github.talelin.autoconfigure.exception.NotFoundException;
import io.github.talelin.latticy.dto.CertificateDTO;
import io.github.talelin.latticy.model.CertificateDO;
import io.github.talelin.latticy.service.CertificateService;
import io.github.talelin.latticy.vo.CreatedVO;
import io.github.talelin.latticy.vo.DeletedVO;
import io.github.talelin.latticy.vo.UpdatedVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.Positive;
import java.util.List;

@RestController
@RequestMapping("/v1/certificate")
@Validated
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    @GetMapping("/{id}")
    public CertificateDO get(@PathVariable("id") @Positive Integer id) {
        CertificateDO certificate = certificateService.getById(id);
        if (certificate == null) {
            throw new NotFoundException("certificate not found", 10022);
        }
        return certificate;
    }

    @GetMapping("")
    public List<CertificateDO> getAll() {
        return certificateService.findAll();
    }

    @PostMapping("")
    public CreatedVO create(@RequestBody @Validated CertificateDTO dto) {
        certificateService.create(dto);
        return new CreatedVO();
    }

    @PutMapping("/{id}")
    public UpdatedVO update(@PathVariable("id") @Positive Integer id, @RequestBody @Validated CertificateDTO dto) {
        CertificateDO certificate = certificateService.getById(id);
        if (certificate == null) {
            throw new NotFoundException("certificate not found", 10022);
        }
        certificateService.update(certificate, dto);
        return new UpdatedVO();
    }

    @DeleteMapping("/{id}")
    public DeletedVO delete(@PathVariable("id") @Positive Integer id) {
        CertificateDO certificate = certificateService.getById(id);
        if (certificate == null) {
            throw new NotFoundException("certificate not found", 10022);
        }
        certificateService.deleteById(id);
        return new DeletedVO();
    }
}
