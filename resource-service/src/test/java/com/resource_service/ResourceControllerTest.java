package com.resource_service;

import com.resource_service.controller.ResourceController;
import com.resource_service.dto.ResourceDto;
import com.resource_service.exception.ResourceNotFoundException;
import com.resource_service.model.Resource;
import com.resource_service.service.ResourceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ResourceControllerTest {
    @Mock
    private ResourceService resourceService;

    @InjectMocks
    private ResourceController resourceController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createResource_Success() {
        ResourceDto inputDto = new ResourceDto();
        ResourceDto createdDto = new ResourceDto();
        when(resourceService.createResource(inputDto)).thenReturn(createdDto);

        ResponseEntity<?> response = resourceController.createResource(inputDto);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(createdDto, response.getBody());
    }

    @Test
    void createResource_Exception() {
        ResourceDto inputDto = new ResourceDto();
        when(resourceService.createResource(inputDto)).thenThrow(new RuntimeException("Error"));

        ResponseEntity<?> response = resourceController.createResource(inputDto);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Error", response.getBody());
    }

    @Test
    void getResourceById_Success() {
        Long resourceId = 1L;
        ResourceDto resourceDto = new ResourceDto();
        when(resourceService.getResourceById(resourceId)).thenReturn(resourceDto);

        ResponseEntity<?> response = resourceController.getResourceById(resourceId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(resourceDto, response.getBody());
    }

    @Test
    void getResourceById_NotFound() {
        Long resourceId = 1L;
        when(resourceService.getResourceById(resourceId)).thenThrow(new ResourceNotFoundException("Resource not found"));

        ResponseEntity<?> response = resourceController.getResourceById(resourceId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Resource not found", response.getBody());
    }

    @Test
    void getAllResources_Success() {
        List<Resource> resources = Arrays.asList(new Resource(), new Resource());
        when(resourceService.getAllResources()).thenReturn(resources);

        ResponseEntity<?> response = resourceController.getAllResources();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(resources, response.getBody());
    }

    @Test
    void getAllResources_NotFound() {
        when(resourceService.getAllResources()).thenThrow(new ResourceNotFoundException("Resources not found"));

        ResponseEntity<?> response = resourceController.getAllResources();

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Resources not found", response.getBody());
    }

    @Test
    void updateResource_Success() {
        Long resourceId = 1L;
        ResourceDto inputDto = new ResourceDto();
        ResourceDto updatedDto = new ResourceDto();
        when(resourceService.updateResource(resourceId, inputDto)).thenReturn(updatedDto);

        ResponseEntity<?> response = resourceController.updateResource(resourceId, inputDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedDto, response.getBody());
    }

    @Test
    void updateResource_NotFound() {
        Long resourceId = 1L;
        ResourceDto inputDto = new ResourceDto();
        when(resourceService.updateResource(resourceId, inputDto)).thenThrow(new ResourceNotFoundException("Resource not found"));

        ResponseEntity<?> response = resourceController.updateResource(resourceId, inputDto);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Resource not found", response.getBody());
    }

    @Test
    void deleteResource_Success() {
        Long resourceId = 1L;
        doNothing().when(resourceService).deleteResource(resourceId);

        ResponseEntity<?> response = resourceController.deleteResource(resourceId);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void deleteResource_NotFound() {
        Long resourceId = 1L;
        doThrow(new ResourceNotFoundException("Resource not found")).when(resourceService).deleteResource(resourceId);

        ResponseEntity<?> response = resourceController.deleteResource(resourceId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Resource not found", response.getBody());
    }
}
