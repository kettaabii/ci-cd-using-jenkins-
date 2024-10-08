package com.project_service.service;

import com.project_service.client.RequestContext;
import com.project_service.dto.ProjectDto;
import com.project_service.enums.Status;
import com.project_service.exception.ProjectNotFoundException;
import com.project_service.mapper.ProjectMapper;
import com.project_service.model.Project;
import com.project_service.repository.elasticsearch.ProjectElasticsearchRepository;
import com.project_service.repository.jpa.ProjectRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.*;
import org.springframework.data.elasticsearch.core.*;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.data.elasticsearch.core.SearchHitSupport;


import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;


@Service
@Transactional
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final RestTemplate restTemplate;
    private final String TASK_SERVICE_URL = "http://task-service/api/tasks";
    private final Logger logger = LoggerFactory.getLogger(ProjectService.class);
    private final ElasticsearchOperations elasticsearchOperations ;
    private final ProjectElasticsearchRepository projectElasticsearchRepository;

    private HttpEntity<Void> createHttpEntity() {
        String token = RequestContext.getJwtToken();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        return new HttpEntity<>(headers);
    }

    public ProjectDto createProject(ProjectDto projectDto) {
        var project = projectMapper.toEntity(projectDto);
        var savedProject = projectRepository.save(project);
        return projectMapper.toDto(savedProject);
    }

    public Page<Project> getAllProjects(int page , int size , String sortField , String sortDirection) {
        Sort.Direction direction = sortDirection.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
        var projects = projectRepository.findAll(pageable);
        if (projects.getContent().isEmpty()) {
            throw new ProjectNotFoundException("Projects not found!");
        }
        return projects;
    }

    public ProjectDto getProjectById(Long id) {
        var project = projectRepository.findById(id).orElseThrow(() -> new ProjectNotFoundException(String.format("Project with %d not found!", id)));
        return projectMapper.toDto(project);
    }

    public ProjectDto updateProject(Long id, ProjectDto projectDto) {
        var project = projectRepository.findById(id).orElseThrow(() -> new ProjectNotFoundException(String.format("Project with %d not found!", id)));
        var updatedProject = projectMapper.partialUpdate(projectDto, project);
        var savedProject = projectRepository.save(updatedProject);
        return projectMapper.toDto(savedProject);
    }

    @CircuitBreaker(name = "taskServiceCircuitBreaker", fallbackMethod = "taskServiceFallback")
    public void deleteProject(Long id) {
        var project = projectRepository.findById(id).orElseThrow(() -> new ProjectNotFoundException(String.format("Project with %d not found!", id)));
        ResponseEntity<List<Long>> tasks = restTemplate.exchange(
                String.format("%s/get-tasks-ids-by-project/%d", TASK_SERVICE_URL, project.getId()),
                HttpMethod.GET,
                createHttpEntity(),
                new ParameterizedTypeReference<List<Long>>() {}
        );

        if (tasks.getStatusCode().is2xxSuccessful()) {
            Objects.requireNonNull(tasks.getBody()).forEach(task ->
                    restTemplate.exchange(
                            String.format("%s/delete-task/%d", TASK_SERVICE_URL, task),
                            HttpMethod.DELETE,
                            createHttpEntity(),
                            Void.class
                    ));
        }
        projectRepository.delete(project);
    }


    public String taskServiceFallback(Long projectId, Throwable throwable) {
        logger.error("Task Service call failed: {}", throwable.getMessage());
        return "Task service is temporarily unavailable. Please try again later.";
    }

    public Page<Project> multiparamFiler(String geolocation , Status status , Double minBudget , Double maxBudget  , int page , int size , String sortField , String sortDirection) {
        Sort.Direction direction = sortDirection.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));

        Specification<Project> spec =(root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }
            if (minBudget != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("budget"), minBudget));
            }
            if (maxBudget != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("budget"), maxBudget));
            }
            if (geolocation != null) {
                predicates.add(criteriaBuilder.equal(root.get("geolocation"), geolocation));
            }
            assert query != null;
            query.orderBy(criteriaBuilder.asc(root.get("name")));

            query.distinct(false);
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
        return projectRepository.findAll(spec,pageable);

    }
    public void indexAllProjects() {
        List<Project> projects = projectRepository.findAll();
        projectElasticsearchRepository.saveAll(projects);
    }

    public List<String> getAutocompleteSuggestions(String query) {
        Page<Project> results=projectElasticsearchRepository.autocomplete(query, Pageable.ofSize(10));
        return results.getContent().stream()
                .map(Project::getName)
                .collect(Collectors.toList());
    }


    public Page<Project> searchProjects(String query , Pageable pageable) {
        return projectElasticsearchRepository.search(query, pageable);
//        Criteria criteria = new Criteria("name").fuzzy(query)
//                .or(new Criteria("description").fuzzy(query));
//
//        CriteriaQuery searchQuery = new CriteriaQuery(criteria)
//                .setPageable(pageable);
//
//        System.out.println(criteria.toString()+"criteria");
//
//        SearchHits<Project> searchHits=elasticsearchOperations.search(searchQuery,Project.class);
//        List<Project> projectList = searchHits.getSearchHits().stream().map(SearchHit::getContent).collect(Collectors.toList());
//        System.out.println(projectList);
//        return new PageImpl<>(projectList,pageable,searchHits.getTotalHits());
    }

}
