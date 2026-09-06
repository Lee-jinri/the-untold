package com.untold.backend.cases.dto;

import java.util.List;

import com.untold.backend.cases.Difficulty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CaseCreateRequest {
	private String title;
	private String premise;
    private String fullTruth;
    private Difficulty difficulty;
    private List<String> keywords;
    private String hint1;
    private String hint2;
}
