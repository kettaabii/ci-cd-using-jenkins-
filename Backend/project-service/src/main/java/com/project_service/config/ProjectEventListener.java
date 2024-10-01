package com.project_service.config;

import com.project_service.model.ProjectChangedEvent;
import com.project_service.repository.elasticsearch.ProjectElasticsearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class ProjectEventListener {

    private final ProjectElasticsearchRepository projectElasticsearchRepository;

    @TransactionalEventListener
    public void handleProjectChangedEvent(ProjectChangedEvent event){
        projectElasticsearchRepository.save(event.getProject());
    }
}
