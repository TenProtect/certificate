package io.github.talelin.latticy.service.impl;

import io.github.talelin.latticy.dto.CertificateDTO;
import io.github.talelin.latticy.mapper.CertificateMapper;
import io.github.talelin.latticy.model.CertificateDO;
import io.github.talelin.latticy.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CertificateServiceImpl implements CertificateService {

    @Autowired
    private CertificateMapper certificateMapper;

    @Override
    public boolean create(CertificateDTO dto) {
        CertificateDO cert = new CertificateDO();
        copyFields(cert, dto);
        return certificateMapper.insert(cert) > 0;
    }

    @Override
    public boolean update(CertificateDO certificate, CertificateDTO dto) {
        copyFields(certificate, dto);
        return certificateMapper.updateById(certificate) > 0;
    }

    @Override
    public CertificateDO getById(Integer id) {
        return certificateMapper.selectById(id);
    }

    @Override
    public List<CertificateDO> findAll() {
        return certificateMapper.selectList(null);
    }

    @Override
    public boolean deleteById(Integer id) {
        return certificateMapper.deleteById(id) > 0;
    }

    private void copyFields(CertificateDO target, CertificateDTO dto) {
        target.setName(dto.getName());
        target.setCategory(dto.getCategory());
        target.setHasReceipt(dto.getHasReceipt());
        target.setPrintSize(dto.getPrintSize());
        target.setPixelSize(dto.getPixelSize());
        target.setResolution(dto.getResolution());
        target.setSaveElectronicPhoto(dto.getSaveElectronicPhoto());
        target.setPrintLayout(dto.getPrintLayout());
        target.setBgColor(dto.getBgColor());
        target.setImageFormat(dto.getImageFormat());
        target.setImageFileSize(dto.getImageFileSize());
        target.setRequirements(dto.getRequirements());
        target.setPrice(dto.getPrice());
    }
}
