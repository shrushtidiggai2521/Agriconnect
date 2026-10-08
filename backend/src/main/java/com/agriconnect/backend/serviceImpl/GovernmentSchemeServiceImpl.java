package com.agriconnect.backend.serviceImpl;

import com.agriconnect.backend.dto.GovernmentSchemeDTO;
import com.agriconnect.backend.mapper.GovernmentSchemeMapper;
import com.agriconnect.backend.service.GovernmentSchemeService;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class GovernmentSchemeServiceImpl implements GovernmentSchemeService {

    private final GovernmentSchemeMapper governmentSchemeMapper;

    public GovernmentSchemeServiceImpl(
            GovernmentSchemeMapper governmentSchemeMapper) {
        this.governmentSchemeMapper = governmentSchemeMapper;
    }

    @Override
    public List<GovernmentSchemeDTO> getSchemes(
            String category,
            String state) {

        List<GovernmentSchemeDTO> schemes = getAllSchemes();

        return schemes.stream()

                // Category filter
                .filter(scheme ->
                        category == null ||
                                category.isBlank() ||
                                scheme.getCategory().equalsIgnoreCase(category)
                )

                // State filter
                .filter(scheme ->
                        state == null ||
                                state.isBlank() ||
                                scheme.getState().equalsIgnoreCase(state) ||
                                scheme.getState().equalsIgnoreCase("ALL")
                )

                .toList();
    }


    @Override
    public List<GovernmentSchemeDTO> getAllSchemes() {

        List<GovernmentSchemeDTO> schemes = new ArrayList<>();

        try {
            ClassPathResource resource =
                    new ClassPathResource("data1/Government_Schemes.csv");

            try (Reader reader = new InputStreamReader(
                    resource.getInputStream(),
                    StandardCharsets.UTF_8
            )) {

                CSVParser parser = CSVFormat.TDF.builder()
                        .setHeader()
                        .setSkipHeaderRecord(true)
                        .setIgnoreEmptyLines(true)
                        .setTrim(true)
                        .build()
                        .parse(reader);

                for (CSVRecord record : parser) {



                    GovernmentSchemeDTO dto =
                            governmentSchemeMapper.toDTO(record);



                    schemes.add(dto);
                }
            }

        }  catch (Exception e) {
            e.printStackTrace();

            throw new RuntimeException(
                    "Failed to read government schemes CSV", e
            );        }

        return schemes;
    }


    @Override
    public GovernmentSchemeDTO getSchemeById(Long id) {

        return getAllSchemes()
                .stream()
                .filter(scheme ->
                        scheme.getId().equals(id)
                )
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException(
                                "Government scheme not found with id: " + id
                        )
                );
    }
}
