package io.github.talelin.latticy.controller.v1;

import io.github.talelin.autoconfigure.exception.NotFoundException;
import io.github.talelin.latticy.model.CertificateDO;
import io.github.talelin.latticy.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.Positive;
import java.util.List;

@RestController
@RequestMapping("/v1/mini/certificate")
@Validated
public class CertificateMiniController {

    @Autowired
    private CertificateService certificateService;

    @GetMapping("")
    public List<CertificateDO> getAll(@RequestParam(value = "keyword", required = false) String keyword) {
        if (keyword != null && !keyword.isEmpty()) {
            return certificateService.search(keyword);
        }
        return certificateService.findAll();
    }

    @GetMapping("/{id}")
    public CertificateDO get(@PathVariable("id") @Positive Integer id) {
        CertificateDO certificate = certificateService.getById(id);
        if (certificate == null) {
            throw new NotFoundException("certificate not found", 10022);
        }
        return certificate;
    }
}
