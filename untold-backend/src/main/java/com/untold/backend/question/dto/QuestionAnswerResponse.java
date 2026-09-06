package com.untold.backend.question.dto;

import java.util.List;

import lombok.Getter;

@Getter
public class QuestionAnswerResponse {
	private final String answer;
    private final List<String> unlockedKeywords;
	private final boolean isSolved;
	
	public QuestionAnswerResponse(String answer, List<String> unlockedKeywords, boolean isSolved) {
        this.answer = answer;
        this.unlockedKeywords = unlockedKeywords;
        this.isSolved = isSolved;
    }
}
