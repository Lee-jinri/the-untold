package com.untold.backend.session;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface GameSessionRepository extends JpaRepository<GameSession, UUID>{

	void deleteByGameCase_Id(UUID id);

}
