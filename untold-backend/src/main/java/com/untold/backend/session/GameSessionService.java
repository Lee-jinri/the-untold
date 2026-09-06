package com.untold.backend.session;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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
		
	    int totalKeywordCount = keywordRepository.findByGameCase_Id(session.getGameCase().getId()).size();

	    List<String> unlockedKeywords = sessionKeywordRepository.findByGameSession_Id(sessionId).stream()
	            .map(sk -> sk.getKeyword().getKeywordText())
	            .collect(Collectors.toList());
	    
	    boolean solved = session.isSolved();
	    String fullTruth = solved ? session.getGameCase().getFullTruth() : null;
	    
	    int hintsRevealed = session.getHintsRevealed();
	    String hint1 = hintsRevealed >= 1 ? session.getGameCase().getHint1() : null;
	    String hint2 = hintsRevealed >= 2 ? session.getGameCase().getHint2() : null;
	    
	    return new SessionProgressResponse(
	            sessionId,
	            session.getGameCase().getTitle(),
	            session.getGameCase().getPremise(),
	            totalKeywordCount,
	            unlockedKeywords,
	            session.isSolved(),
	            fullTruth,
	            session.getQuestionCount(),
	            hintsRevealed,
	            hint1,
	            hint2
	    );
	}
	
	public int revealNextHint(UUID sessionId) {
		GameSession session = gameSessionRepository.findById(sessionId)
				.orElseThrow(() -> new ResourceNotFoundException("세션을 찾을 수 없습니다."));
		
		if(session.getHintsRevealed() < 2) {
			session.setHintsRevealed(session.getHintsRevealed() + 1);
			gameSessionRepository.save(session);
		}
		
		return session.getHintsRevealed();
	}
}
