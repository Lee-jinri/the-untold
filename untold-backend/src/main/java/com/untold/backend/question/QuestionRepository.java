package com.untold.backend.question;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, UUID> {

	void deleteByGameSession_GameCase_Id(UUID id);

}
