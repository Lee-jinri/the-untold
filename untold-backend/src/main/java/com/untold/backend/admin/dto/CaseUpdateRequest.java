package com.untold.backend.admin.dto;

import java.util.List;

import com.untold.backend.cases.Difficulty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CaseUpdateRequest {
    private String title;
    private String premise;
    private String fullTruth;
    private String hint1;
    private String hint2;
    private Difficulty difficulty;
    private List<String> keywords;
}
