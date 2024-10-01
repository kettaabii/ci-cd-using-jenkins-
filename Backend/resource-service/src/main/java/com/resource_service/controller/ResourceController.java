package com.resource_service.controller;

import com.resource_service.dto.ResourceDto;
import com.resource_service.exception.ResourceNotFoundException;
import com.resource_service.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @PostMapping("/create-resource")
    public ResponseEntity<?> createResource(@RequestBody ResourceDto resourceDto) {
        try {
            var createdResource = resourceService.createResource(resourceDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdResource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/get-resource-by-id/{id}")
    public ResponseEntity<?> getResourceById(@PathVariable("id") Long id) {
        try {
            var resourceDto = resourceService.getResourceById(id);
            return ResponseEntity.ok(resourceDto);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/get-all-resources")
    public ResponseEntity<?> getAllResources(
            @RequestParam(defaultValue = "0", name = "page") int page,
            @RequestParam(defaultValue = "10", name = "size") int size,
            @RequestParam(defaultValue = "title", name = "sortField") String sortField,
            @RequestParam(defaultValue = "asc", name = "sortDirection") String sortDirection) {
        try {
            var resources = resourceService.getAllResources(page, size, sortField, sortDirection);
            return ResponseEntity.ok(resources);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/update-resource/{id}")
    public ResponseEntity<?> updateResource(@PathVariable("id") Long id, @RequestBody ResourceDto resourceDto) {
        try {
            var updatedResource = resourceService.updateResource(id, resourceDto);
            return ResponseEntity.ok(updatedResource);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/delete-resource/{id}")
    public ResponseEntity<?> deleteResource(@PathVariable("id") Long id) {
        try {
            resourceService.deleteResource(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
