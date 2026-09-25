package com.untold.backend.cases;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface KeywordRepository extends JpaRepository<Keyword, UUID>{
	List<Keyword> findByGameCase_Id(UUID caseId);
	void deleteByGameCase_Id(UUID id);
	
	@Query(value = """
	        SELECT k.* FROM keywords k
	        WHERE k.case_id = :caseId
	        ORDER BY (k.embedding <=> CAST(:queryVector AS vector)) ASC
	        LIMIT 1
	        """, nativeQuery = true)
	Optional<Keyword> findMostSimilarKeyword(
	        @Param("caseId") UUID caseId,
	        @Param("queryVector") String queryVector
	);
	
	// 디버깅용
	@Query(value = """
	        SELECT k.keyword_text, (1 - (k.embedding <=> CAST(:queryVector AS vector))) as similarity
	        FROM keywords k
	        WHERE k.case_id = :caseId
	        ORDER BY similarity DESC
	        """, nativeQuery = true)
	List<Object[]> findAllSimilarities(
	        @Param("caseId") UUID caseId,
	        @Param("queryVector") String queryVector
	);
}
