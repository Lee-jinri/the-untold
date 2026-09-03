package com.untold.backend.cases;

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
@Table(name = "keywords")
@Getter
@Setter
@NoArgsConstructor
public class Keyword extends BaseEntity{
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "case_id", nullable = false)
	private Case gameCase;
	
	@Column(name = "keyword_text", nullable = false)
	private String keywordText;
}
