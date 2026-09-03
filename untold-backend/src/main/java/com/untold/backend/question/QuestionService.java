package com.untold.backend.question;

import java.util.List;
import java.util.UUID;

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
		
		String answer = llmService.ask(session.getGameCase().getFullTruth(), questionText);
		
		Question question = new Question();
		question.setGameSession(session);
		question.setQuestionText(questionText);
		question.setAiAnswer(answer);
		questionRepository.save(question);
		
		session.setQuestionCount(session.getQuestionCount() + 1);
		
		List<Keyword> allKeywords = keywordRepository.findByGameCase_Id(session.getGameCase().getId());
		for (Keyword keyword : allKeywords) {
			boolean alreadyUnlocked = sessionKeywordRepository
					.existsByGameSession_idAndKeyword_id(sessionId, keyword.getId());
			
			if (!alreadyUnlocked && questionText.contains(keyword.getKeywordText())) {
                SessionKeyword sessionKeyword = new SessionKeyword();
                sessionKeyword.setGameSession(session);
                sessionKeyword.setKeyword(keyword);
                sessionKeywordRepository.save(sessionKeyword);
            }
		}
		
		int unlockedCount = sessionKeywordRepository.findByGameSession_id(sessionId).size();
        boolean isSolved = unlockedCount >= allKeywords.size();

        if (isSolved && !session.isSolved()) {
            session.setSolved(true);
            session.setEndedAt(java.time.LocalDateTime.now());
        }

        gameSessionRepository.save(session);

        return new QuestionAnswerResponse(answer, unlockedCount, isSolved);
	}
}
