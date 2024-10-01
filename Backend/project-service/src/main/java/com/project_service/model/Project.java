package com.project_service.model;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.project_service.enums.Status;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.domain.AfterDomainEventPublication;
import org.springframework.data.domain.DomainEvents;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Document(indexName = "project_index")
@Table(name = "project")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    private Long id;

    @Field(type = FieldType.Text, name = "name")
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "geolocation", nullable = false)
    private String geolocation;

//    @Column(name = "date_start", nullable = false)
//    @JsonFormat(shape = JsonFormat.Shape.NUMBER)
//    private Date dateStart;

//    @Column(name = "date_end", nullable = false)
//    @JsonFormat(shape = JsonFormat.Shape.NUMBER)
//    private Date dateEnd;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @Field(type = FieldType.Text , name = "description")
    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "room", nullable = false)
    private Integer room;

    @Column(name = "bath", nullable = false)
    private Integer bath;

    @Column(name = "garage", nullable = false)
    private Integer garage;

    @Column(name = "terrace", nullable = false)
    private Integer terrace;

    @Column(name = "wall_material", nullable = false)
    private String wallMaterial;

    @Column(name = "foundation_type", nullable = false)
    private String foundationType;

    @Column(name = "roofing_type", nullable = false)
    private String roofingType;

    @Column(name = "area_size", nullable = false)
    private Double areaSize;

    @Column(name = "budget", nullable = false)
    private Double budget;

    @Column(name = "plan_floor", nullable = false)
    private String planFloor;

    @Column(name = "picture", nullable = false)
    private String picture;



    @Transient
    private final List<Object> domainEvents=new ArrayList<>();

    @DomainEvents
    public Collection<Object> domainEvents(){
        return List.copyOf(domainEvents);
    }

    @AfterDomainEventPublication
    public void clearDomainEvents(){
        domainEvents.clear();
    }

    public void registerEvent(Object event){
        domainEvents.add(event);
    }

    @PrePersist
    @PreUpdate
    public void prePersistOrUpdate(){
        registerEvent(new ProjectChangedEvent(this));
    }

}
