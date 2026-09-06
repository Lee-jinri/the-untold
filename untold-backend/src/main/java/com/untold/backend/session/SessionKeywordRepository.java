package com.untold.backend.session;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionKeywordRepository extends JpaRepository<SessionKeyword, UUID>{
	List<SessionKeyword> findByGameSession_id(UUID sessionId);
	boolean existsByGameSession_idAndKeyword_id(UUID sessionId, UUID keywordId);
	void deleteByGameSession_GameCase_Id(UUID id);
	List<SessionKeyword> findByGameSession_Id(UUID sessionId);
}
