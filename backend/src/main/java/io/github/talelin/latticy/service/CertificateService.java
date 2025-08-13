package io.github.talelin.latticy.service;

import io.github.talelin.latticy.dto.CertificateDTO;
import io.github.talelin.latticy.model.CertificateDO;

import java.util.List;

public interface CertificateService {
    boolean create(CertificateDTO dto);
    boolean update(CertificateDO certificate, CertificateDTO dto);
    CertificateDO getById(Integer id);
    List<CertificateDO> findAll();
    List<CertificateDO> search(String keyword);
    boolean deleteById(Integer id);
}
