package com.untold.backend.session.dto;

import java.util.List;
import java.util.UUID;

import lombok.Getter;

@Getter
public class SessionProgressResponse {
	private final UUID sessionId;
	private final String caseTitle;
    private final String premise;
	private final int totalKeywordCount;
	private final List<String> unlockedKeywords;
	private final boolean isSolved;
	private final String fullTruth;
	
	public SessionProgressResponse(UUID sessionId, String caseTitle, String premise, int totalKeywordCount, List<String> unlockedKeywords, boolean isSolved, String fullTruth) {
		this.sessionId = sessionId;
		this.caseTitle = caseTitle;
		this.premise = premise;
		this.totalKeywordCount = totalKeywordCount;
		this.unlockedKeywords = unlockedKeywords;
		this.isSolved = isSolved;
		this.fullTruth = fullTruth;
	}
}
