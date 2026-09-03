package com.untold.backend.cases.dto;

import java.util.UUID;

import com.untold.backend.cases.Case;
import com.untold.backend.cases.Difficulty;

import lombok.Getter;

@Getter
public class CaseDetailResponse {
	private final UUID id;
    private final String title;
    private final String premise;
    private final Difficulty difficulty;
    private final int keywordCount;

    public CaseDetailResponse(Case aCase, int keywordCount) {
        this.id = aCase.getId();
        this.title = aCase.getTitle();
        this.premise = aCase.getPremise();
        this.difficulty = aCase.getDifficulty();
        this.keywordCount = keywordCount;
    }
}
