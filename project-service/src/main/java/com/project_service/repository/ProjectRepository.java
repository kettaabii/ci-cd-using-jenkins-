package com.project_service.repository;

import com.project_service.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;


public interface ProjectRepository extends JpaRepository<Project, Long> , JpaSpecificationExecutor<Project> , ElasticsearchRepository<Project, Long> {

    @Query("{\"multi_match\": {\"query\": \"?0\", \"fields\": [\"name\", \"description\"]: \"phrase_prefix\"}}")
    Page<Project> autocomplete(String query, Pageable pageable);

}
