package com.agriconnect.backend.controller;

import com.agriconnect.backend.dto.GovernmentSchemeDTO;
import com.agriconnect.backend.service.GovernmentSchemeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schemes")
public class GovernmentSchemeController {

    private final GovernmentSchemeService governmentSchemeService;

    public GovernmentSchemeController(
            GovernmentSchemeService governmentSchemeService) {
        this.governmentSchemeService = governmentSchemeService;
    }

    @GetMapping
    public List<GovernmentSchemeDTO> getSchemes(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String state) {

        return governmentSchemeService.getSchemes(category, state);
    }

    @GetMapping("/{id}")
    public GovernmentSchemeDTO getSchemeById(
            @PathVariable Long id) {

        return governmentSchemeService.getSchemeById(id);
    }
}

