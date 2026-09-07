package com.untold.backend.admin;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.untold.backend.admin.dto.CaseAdminResponse;
import com.untold.backend.admin.dto.CaseUpdateRequest;
import com.untold.backend.cases.Case;
import com.untold.backend.cases.CaseService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/cases")
@RequiredArgsConstructor
public class AdminCaseController {
	private final CaseService caseService;
	
    @GetMapping
    public List<CaseAdminResponse> getAllCasesForAdmin() {
        return caseService.getAllCasesForAdmin();
    }

    @GetMapping("/{id}")
    public CaseAdminResponse getCaseForAdmin(@PathVariable UUID id) {
        return caseService.getCaseForAdmin(id);
    }

    @PutMapping("/{id}")
    public Case updateCase(@PathVariable UUID id, @RequestBody CaseUpdateRequest request) {
        return caseService.updateCase(id, request);
    }
    
    @DeleteMapping("/{id}")
    public void deleteCase(@PathVariable UUID id) {
        caseService.deleteCase(id);
    }
}
