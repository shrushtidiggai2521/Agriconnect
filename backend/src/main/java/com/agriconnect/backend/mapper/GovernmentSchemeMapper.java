package com.agriconnect.backend.mapper;

    import com.agriconnect.backend.dto.GovernmentSchemeDTO;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Component;

    @Component
    public class GovernmentSchemeMapper {

        public GovernmentSchemeDTO toDTO(CSVRecord record) {

            GovernmentSchemeDTO dto = new GovernmentSchemeDTO();

            dto.setId(Long.parseLong(record.get("id")));
            dto.setName(record.get("name"));
            dto.setShortDescription(record.get("shortDescription"));
            dto.setCategory(record.get("category"));
            dto.setBenefits(record.get("benefits"));
            dto.setEligibility(record.get("eligibility"));
            dto.setWhoCanApply(record.get("whoCanApply"));
            dto.setDocumentsRequired(record.get("documentsRequired"));
            dto.setState(record.get("state"));
            dto.setOfficialInfoUrl(record.get("officialInfoUrl"));
            dto.setOfficialApplyUrl(record.get("officialApplyUrl"));
            dto.setHelpline(record.get("helpline"));
            dto.setLastUpdated(record.get("lastUpdated"));

            return dto;
        }
    }
