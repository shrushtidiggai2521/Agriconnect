package com.agriconnect.backend.service;


import com.agriconnect.backend.dto.GovernmentSchemeDTO;

import java.util.List;

    public interface GovernmentSchemeService {

        List<GovernmentSchemeDTO> getAllSchemes();

        GovernmentSchemeDTO getSchemeById(Long id);

        List<GovernmentSchemeDTO> getSchemes(
                String category,
                String state
        );
    }
