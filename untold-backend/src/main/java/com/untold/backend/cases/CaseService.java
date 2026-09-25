package com.untold.backend.cases;

import java.util.ArrayList;
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
        newCase.setJudgmentNotes(request.getJudgmentNotes());
        
        Case savedCase = caseRepository.save(newCase);
        
        List<String> keywordTexts = request.getKeywords();
        List<String> expandedTexts = request.getExpandedTexts();
		        
        List<Keyword> keywords = new ArrayList<>();
        for (int i = 0; i < keywordTexts.size(); i++) {
            String text = keywordTexts.get(i);
            String expandedText = expandedTexts.get(i);
            
            Keyword keyword = new Keyword();
            keyword.setGameCase(newCase);
            keyword.setKeywordText(text);
            keyword.setExpandedText(expandedText); // 관리자 화면에 보여줄 용도
            
            keywords.add(keyword);
        }
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
	            	List<Keyword> keywordEntities = keywordRepository.findByGameCase_Id(c.getId());
	                return new CaseAdminResponse(c, keywordEntities);
	            })
	            .collect(Collectors.toList());
	}

	public CaseAdminResponse getCaseForAdmin(UUID id) {
		Case aCase = caseRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("사건을 찾을 수 없습니다: " + id));

		List<Keyword> keywordEntities = keywordRepository.findByGameCase_Id(id);

	    return new CaseAdminResponse(aCase, keywordEntities);
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
	    aCase.setJudgmentNotes(request.getJudgmentNotes());
	    System.out.println("------------------------------");
	    System.out.println(request.getJudgmentNotes());
	    caseRepository.save(aCase);

        sessionKeywordRepository.deleteByGameSession_GameCase_Id(id);
        keywordRepository.deleteByGameCase_Id(id);
        
	    List<String> keywordTexts = request.getKeywords();
        List<String> expandedTexts = request.getExpandedTexts();

        List<Keyword> newKeywords = new ArrayList<>();
        for (int i = 0; i < keywordTexts.size(); i++) {
            String text = keywordTexts.get(i);
            String expandedText = expandedTexts.get(i);

            Keyword keyword = new Keyword();
            keyword.setGameCase(aCase);
            keyword.setKeywordText(text);
            keyword.setExpandedText(expandedText);
            
            newKeywords.add(keyword);
        }
        keywordRepository.saveAll(newKeywords);
	    return aCase;
	}
}
