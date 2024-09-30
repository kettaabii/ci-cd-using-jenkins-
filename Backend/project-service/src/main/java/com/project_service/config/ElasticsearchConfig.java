package com.project_service.config;


import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;



@Configuration
@EnableElasticsearchRepositories(basePackages = "com.project_service.repository.elasticsearch")
@EnableJpaRepositories(basePackages = "com.project_service.repository.jpa")
public class ElasticsearchConfig extends ElasticsearchConfiguration {

//    @Bean
//    public RestClient restClient() {
//        return RestClient.builder(new HttpHost("localhost", 9200)).build();
//    }
//
    @Bean
    public ElasticsearchTransport elasticsearchTransport(RestClient restClient) {
        return new RestClientTransport(restClient,new JacksonJsonpMapper());
    }
//
//    @Bean
//    public ElasticsearchClient elasticsearchClient(ElasticsearchTransport transport) {
//        return new ElasticsearchClient(transport);
//    }


    @Override
    public ClientConfiguration clientConfiguration() {
        return ClientConfiguration.builder()
                .connectedTo("localhost:9200")
                .build();
    }

    @Bean
    public ElasticsearchOperations elasticsearchTemplate(ElasticsearchClient elasticsearchClient) {
        return new ElasticsearchTemplate(elasticsearchClient);
    }



}
