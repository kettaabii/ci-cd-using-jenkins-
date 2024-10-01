package com.project_service.config;




import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.elasticsearch.core.convert.ElasticsearchCustomConversions;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class CustomConversionConfig {

    @Bean
    public ElasticsearchCustomConversions elasticsearchCustomConversions() {
        List<Converter<?, ?>> converters = new ArrayList<>();
        converters.add(new LongToDateConverter());
        converters.add(new DateToLongConverter());
        return new ElasticsearchCustomConversions(converters);
    }

    static class LongToDateConverter implements Converter<Long, Date> {
        @Override
        public Date convert(Long source) {
            return new Date(source);
        }
    }
    static class DateToLongConverter implements Converter<Date, Long> {
        @Override
        public Long convert(Date source) {
            return source.getTime();
        }
    }

}
