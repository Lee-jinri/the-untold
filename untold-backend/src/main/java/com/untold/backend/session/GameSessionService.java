package com.untold.backend.session;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.untold.backend.cases.Case;
import com.untold.backend.cases.CaseRepository;
import com.untold.backend.cases.KeywordRepository;
import com.untold.backend.common.exception.ResourceNotFoundException;
import com.untold.backend.session.dto.SessionProgressResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GameSessionService {
	private final GameSessionRepository gameSessionRepository;
	private final CaseRepository caseRepository;
	private final SessionKeywordRepository sessionKeywordRepository;
	private final KeywordRepository keywordRepository;
	
	public GameSession startSession(UUID caseId){
		Case gameCase = caseRepository.findById(caseId)
				.orElseThrow(() -> new ResourceNotFoundException("사건을 찾을 수 없습니다."));
		
		GameSession session = new GameSession();
		session.setGameCase(gameCase);
		
		return gameSessionRepository.save(session);
	}
	
	public GameSession getSessionById(UUID id) {
		return gameSessionRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("세션을 찾을 수 없습니다."));
	}
	
	public SessionProgressResponse getProgress(UUID sessionId) {
		GameSession session = gameSessionRepository.findById(sessionId)
				.orElseThrow(() -> new ResourceNotFoundException("세션을 찾을 수 없습니다."));
		
	    int unlockedCount = sessionKeywordRepository.findByGameSession_id(sessionId).size();
	    int totalKeywordCount = keywordRepository.findByGameCase_Id(session.getGameCase().getId()).size();

	    return new SessionProgressResponse(
	            sessionId,
	            session.getGameCase().getTitle(),
	            session.getGameCase().getPremise(),
	            unlockedCount,
	            totalKeywordCount,
	            session.isSolved()
	    );
	}
}
