package com.project_service;

import com.project_service.controller.ProjectController;
import com.project_service.dto.ProjectDto;
import com.project_service.exception.ProjectNotFoundException;
import com.project_service.model.Project;
import com.project_service.service.ProjectService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

public class ProjectControllerTest {

    @Mock
    private ProjectService projectService;

    @InjectMocks
    private ProjectController projectController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllProjects() {
        List<Project> projects = Arrays.asList(new Project(), new Project());
        when(projectService.getAllProjects()).thenReturn(projects);

        ResponseEntity<?> response = projectController.getAllProjects();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(projects, response.getBody());

    }

    @Test
    public void testGetAllProjectsNotFound() {
        when(projectService.getAllProjects()).thenThrow(new ProjectNotFoundException("Projects not found!"));

        ResponseEntity<?> response = projectController.getAllProjects();
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Projects not found!", response.getBody());
    }

    @Test
    public void testGetProjectById() {
        Long projectId = 1L;
        ProjectDto project = new ProjectDto();
        when(projectService.getProjectById(projectId)).thenReturn(project);

        ResponseEntity<?> response = projectController.getProjectById(projectId.toString());
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(project, response.getBody());
    }

    @Test
    public void testGetProjectByIdNotFound() {
        Long projectId = 1L;
        when(projectService.getProjectById(projectId))
                .thenThrow(new ProjectNotFoundException(String.format("Project with %d not found!", projectId)));

        ResponseEntity<?> response = projectController.getProjectById(projectId.toString());
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(String.format("Project with %d not found!", projectId), response.getBody());
    }


    @Test
    public void testCreateProject() {
        ProjectDto projectDto = new ProjectDto();
        ProjectDto createdProjectDto = new ProjectDto();
        when(projectService.createProject(projectDto)).thenReturn(createdProjectDto);

        ResponseEntity<?> response = projectController.createProject(projectDto);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(createdProjectDto, response.getBody());
    }

    @Test
    public void testCreateProjectException() {
        ProjectDto projectDto = new ProjectDto();
        when(projectService.createProject(projectDto))
                .thenThrow(new RuntimeException("Error creating project"));

        ResponseEntity<?> response = projectController.createProject(projectDto);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Error creating project", response.getBody());
    }


    @Test
    public void testUpdateProject() {
        Long projectId = 1L;
        ProjectDto projectDto = new ProjectDto();
        ProjectDto updatedProjectDto = new ProjectDto();
        when(projectService.updateProject(projectId, projectDto)).thenReturn(updatedProjectDto);

        ResponseEntity<?> response = projectController.updateProject(projectId.toString(), projectDto);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedProjectDto, response.getBody());
    }

    @Test
    public void testUpdateProjectNotFound() {
        Long projectId = 1L;
        ProjectDto projectDto = new ProjectDto();
        when(projectService.updateProject(projectId, projectDto))
                .thenThrow(new ProjectNotFoundException(String.format("Project with %d not found!", projectId)));

        ResponseEntity<?> response = projectController.updateProject(projectId.toString(), projectDto);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(String.format("Project with %d not found!", projectId), response.getBody());
    }


    @Test
    public void testDeleteProject() {
        Long projectId = 1L;

        ResponseEntity<?> response = projectController.deleteProject(projectId.toString());
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    @Test
    public void testDeleteProjectNotFound() {
        Long projectId = 1L;
        doThrow(new ProjectNotFoundException(String.format("Project with %d not found!", projectId)))
                .when(projectService).deleteProject(projectId);

        ResponseEntity<?> response = projectController.deleteProject(projectId.toString());
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(String.format("Project with %d not found!", projectId), response.getBody());
    }

    @Test
    public void testDeleteProjectException() {
        Long projectId = 1L;
        doThrow(new RuntimeException("Error deleting project"))
                .when(projectService).deleteProject(projectId);

        ResponseEntity<?> response = projectController.deleteProject(projectId.toString());
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Error deleting project", response.getBody());
    }

}
