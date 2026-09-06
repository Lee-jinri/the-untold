package com.untold.backend.cases;

import com.untold.backend.common.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cases")
@Getter
@Setter
@NoArgsConstructor
public class Case extends BaseEntity {
	@Column(nullable = false)
	private String title;
	
	@Column(name = "premise", columnDefinition = "TEXT", nullable = false)
    private String premise;

    @Column(name = "full_truth", columnDefinition = "TEXT", nullable = false)
    private String fullTruth;
	
	@Enumerated(EnumType.STRING)
	private Difficulty difficulty;
	
	@Column(name = "hint1", columnDefinition = "TEXT")
	private String hint1;
	
	@Column(name = "hint2", columnDefinition = "TEXT")
	private String hint2;
}
