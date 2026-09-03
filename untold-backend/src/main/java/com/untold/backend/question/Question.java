package com.untold.backend.question;

import com.untold.backend.common.entity.BaseEntity;
import com.untold.backend.session.GameSession;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
public class Question extends BaseEntity {
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "session_id", nullable = false)
	private GameSession gameSession;
	
	@Column(name = "question_text", columnDefinition = "TEXT", nullable = false)
	private String questionText;
	
	@Column(name = "ai_answer", nullable = false)
	private String aiAnswer;
}
