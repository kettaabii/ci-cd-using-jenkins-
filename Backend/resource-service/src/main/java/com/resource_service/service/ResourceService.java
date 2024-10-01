package com.resource_service.service;

import com.resource_service.dto.ResourceDto;
import com.resource_service.exception.ResourceNotFoundException;
import com.resource_service.mapper.ResourceMapper;
import com.resource_service.model.Resource;
import com.resource_service.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final ResourceMapper resourceMapper;

    public ResourceDto createResource(ResourceDto resourceDto) {
        var resource = resourceMapper.toEntity(resourceDto);
        var savedResource = resourceRepository.save(resource);
        return resourceMapper.toDto(savedResource);
    }

    public ResourceDto getResourceById(Long id) {
        var resource = resourceRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(String.format("Resource with "+id +" not found !")));
        return resourceMapper.toDto(resource);
    }

    public Page<ResourceDto> getAllResources(int page, int size, String sortField, String sortDirection) {
        Sort.Direction direction = sortDirection.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
        var resources = resourceRepository.findAll(pageable);
        if (resources.getContent().isEmpty()) {
            throw new ResourceNotFoundException("Resources not found!");
        }
        return resources.map(resourceMapper::toDto);
    }

    public ResourceDto updateResource(Long id, ResourceDto resourceDto) {
        var resource = resourceRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(String.format("Resource with "+id +" not found !")));
        var updatedResource = resourceMapper.partialUpdate(resourceDto, resource);
        var savedResource = resourceRepository.save(updatedResource);
        return resourceMapper.toDto(savedResource);
    }

    public void deleteResource(Long id) {
        var resource = resourceRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(String.format("Resource with "+ id +"not found !")));
        resourceRepository.delete(resource);
    }
}
