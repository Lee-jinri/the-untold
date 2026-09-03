package com.untold.backend.question.dto;

import lombok.Getter;

@Getter
public class QuestionAnswerResponse {
	private final String answer;
	private final int unlockedCount;
	private final boolean isSolved;
	
	public QuestionAnswerResponse(String answer, int unlockedCount, boolean isSolved) {
        this.answer = answer;
        this.unlockedCount = unlockedCount;
        this.isSolved = isSolved;
    }
}
