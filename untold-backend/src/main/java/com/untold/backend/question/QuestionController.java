package com.untold.backend.question;

import java.util.UUID;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.untold.backend.question.dto.QuestionAnswerResponse;
import com.untold.backend.question.dto.QuestionCreateRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class QuestionController {
	private final QuestionService questionService;
	
	@PostMapping("/{sessionId}/questions")
    public QuestionAnswerResponse ask(
            @PathVariable UUID sessionId,
            @RequestBody QuestionCreateRequest request
    ) {
        return questionService.ask(sessionId, request.getQuestionText());
    }
}
