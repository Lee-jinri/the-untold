package com.untold.backend.admin.dto;

import java.util.List;
import java.util.UUID;

import com.untold.backend.cases.Case;
import com.untold.backend.cases.Difficulty;
import com.untold.backend.cases.Keyword;

import lombok.Getter;

@Getter
public class CaseAdminResponse {
    private final UUID id;
    private final String title;
    private final String premise;
    private final String fullTruth;
    private final String hint1;
    private final String hint2;
    private final Difficulty difficulty;
    private final List<String> keywords;
    private final List<String> expandedTexts;
    private final String judgmentNotes;

    public CaseAdminResponse(Case aCase, List<Keyword> keywordEntities) {
        this.id = aCase.getId();
        this.title = aCase.getTitle();
        this.premise = aCase.getPremise();
        this.fullTruth = aCase.getFullTruth();
        this.hint1 = aCase.getHint1();
        this.hint2 = aCase.getHint2();
        this.difficulty = aCase.getDifficulty();
        this.keywords = keywordEntities.stream()
                .map(Keyword::getKeywordText)
                .collect(java.util.stream.Collectors.toList());
        this.expandedTexts = keywordEntities.stream()
                .map(Keyword::getExpandedText)
                .collect(java.util.stream.Collectors.toList());
        this.judgmentNotes = aCase.getJudgmentNotes();
    }
}
