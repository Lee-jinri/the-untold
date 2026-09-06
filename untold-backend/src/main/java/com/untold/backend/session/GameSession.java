package com.untold.backend.session;

import java.time.LocalDateTime;

import com.untold.backend.cases.Case;
import com.untold.backend.common.entity.BaseEntity;

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
@Table(name = "game_sessions")
@Getter
@Setter
@NoArgsConstructor
public class GameSession extends BaseEntity {
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "case_id", nullable = false)
	private Case gameCase;
	
	@Column(name = "is_solved", nullable = false)
	private boolean isSolved = false;
	
	@Column(name = "question_count", nullable = false)
	private int questionCount = 0;
	
	@Column(name = "hints_revealed", nullable = false)
	private int hintsRevealed = 0;
	
	private LocalDateTime endedAt;
}