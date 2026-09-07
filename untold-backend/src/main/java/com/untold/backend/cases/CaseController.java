package com.untold.backend.cases;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.untold.backend.cases.dto.CaseCreateRequest;
import com.untold.backend.cases.dto.CaseDetailResponse;
import com.untold.backend.cases.dto.CaseListItem;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cases")
@RequiredArgsConstructor
public class CaseController {
	private final CaseService caseService;
	
	@PostMapping
	public Case createCase(@RequestBody CaseCreateRequest request) {
		return caseService.createCase(request);
	}
	
	@GetMapping
	public List<CaseListItem> getAllCases(){
		return caseService.getAllCases();
	}
	
	@GetMapping("/{id}")
	public CaseDetailResponse getCaseById(@PathVariable UUID id) {
		return caseService.getCaseDetail(id);
	}
}
