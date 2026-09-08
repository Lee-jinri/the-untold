package com.untold.backend.question;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.untold.backend.cases.Keyword;
import com.untold.backend.cases.KeywordRepository;
import com.untold.backend.common.exception.ResourceNotFoundException;
import com.untold.backend.question.dto.QuestionAnswerResponse;
import com.untold.backend.session.GameSession;
import com.untold.backend.session.GameSessionRepository;
import com.untold.backend.session.SessionKeyword;
import com.untold.backend.session.SessionKeywordRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QuestionService {
	private final QuestionRepository questionRepository;
	private final GameSessionRepository gameSessionRepository;
	private final KeywordRepository keywordRepository;
    private final SessionKeywordRepository sessionKeywordRepository;
	private final LlmService llmService;
	
	@Transactional
	public QuestionAnswerResponse ask(UUID sessionId, String questionText) {
		GameSession session = gameSessionRepository.findById(sessionId)
				.orElseThrow(() -> new ResourceNotFoundException("세션을 찾을 수 없습니다."));
		
		List<Keyword> allKeywords = keywordRepository.findByGameCase_Id(session.getGameCase().getId());
		List<String> keywordTexts = allKeywords.stream()
				.map(Keyword::getKeywordText)
				.collect(Collectors.toList());
		LlmAnswer llmAnswer = llmService.ask(session.getGameCase().getFullTruth(), questionText, keywordTexts);
		
		Question question = new Question();
		question.setGameSession(session);
		question.setQuestionText(questionText);
		question.setAiAnswer(llmAnswer.getAnswer());
		questionRepository.save(question);
		
		session.setQuestionCount(session.getQuestionCount() + 1);
		
		if(session.getQuestionCount() == 10 && session.getHintsRevealed() < 1) {
			session.setHintsRevealed(1);
		}else if(session.getQuestionCount() == 20 && session.getHintsRevealed() < 2) {
			session.setHintsRevealed(2);
		}
		
		for (String matchedKeywordText : llmAnswer.getMatchedKeywords()) {
	        allKeywords.stream()
	                .filter(k -> k.getKeywordText().equals(matchedKeywordText))
	                .findFirst()
	                .ifPresent(keyword -> {
	                    boolean alreadyUnlocked = sessionKeywordRepository
	                            .existsByGameSession_IdAndKeyword_Id(sessionId, keyword.getId());
	                    if (!alreadyUnlocked) {
	                        SessionKeyword sessionKeyword = new SessionKeyword();
	                        sessionKeyword.setGameSession(session);
	                        sessionKeyword.setKeyword(keyword);
	                        sessionKeywordRepository.save(sessionKeyword);
	                    }
	                });
	    }

	    // 전부 해금됐는지 체크
	    List<String> unlockedKeywords = sessionKeywordRepository.findByGameSession_Id(sessionId).stream()
	            .map(sk -> sk.getKeyword().getKeywordText())
	            .collect(Collectors.toList());
	    boolean isSolved = unlockedKeywords.size() >= allKeywords.size();

	    if (isSolved && !session.isSolved()) {
	        session.setSolved(true);
	        session.setEndedAt(java.time.LocalDateTime.now());
	    }

	    gameSessionRepository.save(session);

	    return new QuestionAnswerResponse(llmAnswer.getAnswer(), unlockedKeywords, isSolved);
	}
}
