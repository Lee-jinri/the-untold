package com.untold.backend.session.dto;

import java.util.UUID;

import lombok.Getter;

@Getter
public class SessionProgressResponse {
	private final UUID sessionId;
	private final String caseTitle;
    private final String premise;
	private final int unlockedCount;
	private final int totalKeywordCount;
	private final boolean isSolved;
	
	public SessionProgressResponse(UUID sessionId, String caseTitle, String premise, int unlockedCount, int totalKeywordCount, boolean isSolved) {
		this.sessionId = sessionId;
		this.caseTitle = caseTitle;
		this.premise = premise;
		this.unlockedCount = unlockedCount;
		this.totalKeywordCount = totalKeywordCount;
		this.isSolved = isSolved;
	}
}
