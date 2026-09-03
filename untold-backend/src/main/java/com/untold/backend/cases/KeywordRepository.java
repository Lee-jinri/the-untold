package com.untold.backend.cases;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface KeywordRepository extends JpaRepository<Keyword, UUID>{
	List<Keyword> findByGameCase_Id(UUID caseId);
	void deleteByGameCase_Id(UUID id);
}
