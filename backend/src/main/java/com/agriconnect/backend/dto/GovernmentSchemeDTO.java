package com.agriconnect.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class GovernmentSchemeDTO {

        private Long id;
        private String name;
        private String shortDescription;
        private String category;
        private String benefits;
        private String eligibility;
        private String whoCanApply;
        private String documentsRequired;
        private String state;
        private String officialInfoUrl;
        private String officialApplyUrl;
        private String helpline;
        private String lastUpdated;
    }

