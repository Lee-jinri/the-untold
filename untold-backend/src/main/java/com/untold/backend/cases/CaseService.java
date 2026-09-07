package com.untold.backend.cases;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.untold.backend.admin.dto.CaseAdminResponse;
import com.untold.backend.admin.dto.CaseUpdateRequest;
import com.untold.backend.cases.dto.CaseCreateRequest;
import com.untold.backend.cases.dto.CaseDetailResponse;
import com.untold.backend.cases.dto.CaseListItem;
import com.untold.backend.common.exception.ResourceNotFoundException;
import com.untold.backend.question.QuestionRepository;
import com.untold.backend.session.GameSessionRepository;
import com.untold.backend.session.SessionKeywordRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CaseService {

	private final CaseRepository caseRepository;
	private final KeywordRepository keywordRepository;
	private final GameSessionRepository gameSessionRepository;
    private final QuestionRepository questionRepository;
    private final SessionKeywordRepository sessionKeywordRepository; 
	
	public Case createCase(CaseCreateRequest request) {
		Case newCase = new Case();
        newCase.setTitle(request.getTitle());
        newCase.setPremise(request.getPremise());
        newCase.setFullTruth(request.getFullTruth());
        newCase.setDifficulty(request.getDifficulty());
        newCase.setHint1(request.getHint1());
        newCase.setHint2(request.getHint2());
        
        Case savedCase = caseRepository.save(newCase);
		
        List<Keyword> keywords = request.getKeywords().stream()
                .map(text -> {
                    Keyword keyword = new Keyword();
                    keyword.setGameCase(savedCase);
                    keyword.setKeywordText(text);
                    return keyword;
                })
                .collect(Collectors.toList());
        keywordRepository.saveAll(keywords);

        return savedCase;
	}
	
	public List<CaseListItem> getAllCases() {
		return caseRepository.findAll().stream()
	            .map(CaseListItem::new)
	            .collect(Collectors.toList());
    }
	
	public Case getCaseById(UUID id) {
		return caseRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("사건을 찾을 수 없습니다."));
	}
	
	@Transactional
	public void deleteCase(UUID id) {
		sessionKeywordRepository.deleteByGameSession_GameCase_Id(id);
        questionRepository.deleteByGameSession_GameCase_Id(id);
        gameSessionRepository.deleteByGameCase_Id(id);
        keywordRepository.deleteByGameCase_Id(id);
        caseRepository.deleteById(id);
	}
	
	public CaseDetailResponse getCaseDetail(UUID id) {
	    Case caseEntity = caseRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("사건을 찾을 수 없어요: " + id));

	    int keywordCount = keywordRepository.findByGameCase_Id(id).size();

	    return new CaseDetailResponse(caseEntity, keywordCount);
	}

	public List<CaseAdminResponse> getAllCasesForAdmin() {
		return caseRepository.findAll().stream()
	            .map(c -> {
	                List<String> keywords = keywordRepository.findByGameCase_Id(c.getId()).stream()
	                        .map(Keyword::getKeywordText)
	                        .collect(Collectors.toList());
	                return new CaseAdminResponse(c, keywords);
	            })
	            .collect(Collectors.toList());
	}

	public CaseAdminResponse getCaseForAdmin(UUID id) {
		Case aCase = caseRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("사건을 찾을 수 없습니다: " + id));

	    List<String> keywords = keywordRepository.findByGameCase_Id(id).stream()
	            .map(Keyword::getKeywordText)
	            .collect(Collectors.toList());

	    return new CaseAdminResponse(aCase, keywords);
	}

	@Transactional
	public Case updateCase(UUID id, CaseUpdateRequest request) {
		Case aCase = caseRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("사건을 찾을 수 없습니다: " + id));

	    aCase.setTitle(request.getTitle());
	    aCase.setPremise(request.getPremise());
	    aCase.setFullTruth(request.getFullTruth());
	    aCase.setHint1(request.getHint1());
	    aCase.setHint2(request.getHint2());
	    aCase.setDifficulty(request.getDifficulty());
	    caseRepository.save(aCase);

	    keywordRepository.deleteByGameCase_Id(id);
	    List<Keyword> newKeywords = request.getKeywords().stream()
	            .map(text -> {
	                Keyword keyword = new Keyword();
	                keyword.setGameCase(aCase);
	                keyword.setKeywordText(text);
	                return keyword;
	            })
	            .collect(Collectors.toList());
	    keywordRepository.saveAll(newKeywords);

	    return aCase;
	}
}
