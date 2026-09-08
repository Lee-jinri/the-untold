package com.untold.backend.question;

import java.util.List;

import lombok.Getter;

@Getter
public class LlmAnswer {
	private final String answer;
	private final List<String> matchedKeywords;
	
	public LlmAnswer(String answer, List<String> matchedKeywords) {
		this.answer = answer;
		this.matchedKeywords = matchedKeywords;
	}
}
