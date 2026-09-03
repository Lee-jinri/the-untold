package com.untold.backend.cases.dto;

import java.util.UUID;

import com.untold.backend.cases.Case;
import com.untold.backend.cases.Difficulty;

import lombok.Getter;

@Getter
public class CaseListItem {
    private final UUID id;
    private final String title;
    private final Difficulty difficulty;

    public CaseListItem(Case aCase) {
        this.id = aCase.getId();
        this.title = aCase.getTitle();
        this.difficulty = aCase.getDifficulty();
    }
}