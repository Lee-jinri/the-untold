package com.untold.backend.session;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionKeywordRepository extends JpaRepository<SessionKeyword, UUID>{
	boolean existsByGameSession_IdAndKeyword_Id(UUID sessionId, UUID keywordId);
	void deleteByGameSession_GameCase_Id(UUID id);
	List<SessionKeyword> findByGameSession_Id(UUID sessionId);
}
