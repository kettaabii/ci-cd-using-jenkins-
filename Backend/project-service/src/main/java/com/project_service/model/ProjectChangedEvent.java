package com.project_service.model;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ProjectChangedEvent {
    private final Project project;

    public Project getProject() {
        return project;
    }
}
