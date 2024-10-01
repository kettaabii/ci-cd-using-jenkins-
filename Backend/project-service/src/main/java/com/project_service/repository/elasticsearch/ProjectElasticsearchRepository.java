package com.project_service.repository.elasticsearch;

import com.project_service.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectElasticsearchRepository extends ElasticsearchRepository<Project, Long> {
    @Query("{\"multi_match\": {\"query\": \"?0\", \"fields\": [\"name\", \"description\"], \"type\": \"phrase_prefix\"}}")
    Page<Project> autocomplete(String query, Pageable pageable);

    List<Project> findAllByOrderByNameAsc();

}
