package com.untold.backend.session;

import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.untold.backend.session.dto.SessionProgressResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class GameSessionController {
	private final GameSessionService gameSessionService;
	
	@PostMapping("/cases/{caseId}/sessions")
	public GameSession startSession(@PathVariable UUID caseId) {
		return gameSessionService.startSession(caseId);
	}
	
	@GetMapping("/sessions/{sessionId}")
	public GameSession getSession(@PathVariable UUID sessionId) {
		return gameSessionService.getSessionById(sessionId);
	}
	
	@GetMapping("/sessions/{sessionId}/progress")
	public SessionProgressResponse getProgress(@PathVariable UUID sessionId) {
		return gameSessionService.getProgress(sessionId);
	}
	
	@PostMapping("/sessions/{sessionId}/hints")
	public int revealHint(@PathVariable UUID sessionId) {
		return gameSessionService.revealNextHint(sessionId);
	}
}
