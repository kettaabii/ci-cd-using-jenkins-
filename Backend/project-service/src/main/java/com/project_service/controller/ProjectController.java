package com.project_service.controller;

import com.project_service.dto.ProjectDto;
import com.project_service.enums.Status;
import com.project_service.exception.ProjectNotFoundException;
import com.project_service.model.Project;
import com.project_service.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.SearchPage;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/api/project")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping("/get-all-projects")
    public ResponseEntity<?> getAllProjects(
            @RequestParam(defaultValue = "0" , name = "page") int page ,
            @RequestParam(defaultValue = "10", name= "size") int size ,
            @RequestParam(defaultValue = "name" , name ="sortField") String sortField ,
            @RequestParam(defaultValue = "asc" , name = "sortDirection") String sortDirection )
    {
        try {
            var projects = projectService.getAllProjects(page,size , sortField , sortDirection);
            return ResponseEntity.ok(projects);
        } catch (ProjectNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/get-project-by-id/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable("id") String id) {
        try {
            var project = projectService.getProjectById(Long.valueOf(id));
            return ResponseEntity.ok(project);
        } catch (ProjectNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/create-project")
    public ResponseEntity<?> createProject(@RequestBody ProjectDto projectDto) {
        try {
            var createdProject = projectService.createProject(projectDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/update-project/{id}")
    public ResponseEntity<?> updateProject(
            @PathVariable("id") String id,
            @ModelAttribute ProjectDto projectDto) {
        try {
            var updatedProject = projectService.updateProject(Long.valueOf(id), projectDto);
            return ResponseEntity.ok(updatedProject);
        } catch (ProjectNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/delete-project/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable("id") String id) {
        try {
            projectService.deleteProject(Long.valueOf(id));
            return ResponseEntity.noContent().build();
        } catch (ProjectNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<?> filterProjects(
            @RequestParam(required = false, name = "geolocation") String geolocation,
            @RequestParam(required = false, name = "status") Status status,
            @RequestParam(required = false, name = "minBudget") Double minBudget,
            @RequestParam(required = false, name = "maxBudget") Double maxBudget,
            @RequestParam(defaultValue = "0", name = "page") int page,
            @RequestParam(defaultValue = "10", name = "size") int size,
            @RequestParam(defaultValue = "name", name = "sortField") String sortField,
            @RequestParam(defaultValue = "asc", name = "sortDirection") String sortDirection) {
        try {
            var projects = projectService.multiparamFiler(geolocation, status, minBudget, maxBudget, page, size, sortField, sortDirection);
            return ResponseEntity.ok(projects);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/index")
    public ResponseEntity<String> indexAllProjects(){
        projectService.indexAllProjects();
        return ResponseEntity.ok("indexing completed");
    }

    @GetMapping("/autocomplete")
    public ResponseEntity<List<String>> autocomplete(@RequestParam( name = "term") String term) {
        List<String> suggestions = projectService.getAutocompleteSuggestions(term);
        return ResponseEntity.ok(suggestions);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Project>> searchProjects(
            @RequestParam(name = "term") String query ,
            @RequestParam(defaultValue = "0",name = "page") int page ,
            @RequestParam(defaultValue = "10",name = "size") int size ){
        PageRequest pageable = PageRequest.of(page,size);
        Page<Project> searchResults = projectService.searchProjects(query,pageable);
        return ResponseEntity.ok(searchResults);
    }



}
