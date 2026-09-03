package com.untold.backend.cases;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CaseRepository extends JpaRepository<Case, UUID>{

}
