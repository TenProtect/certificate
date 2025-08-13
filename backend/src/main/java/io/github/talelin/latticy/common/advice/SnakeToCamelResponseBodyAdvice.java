package io.github.talelin.latticy.common.advice;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Add camelCase fields for every snake_case field in responses.
 */
@RestControllerAdvice
public class SnakeToCamelResponseBodyAdvice implements ResponseBodyAdvice<Object> {

    private final ObjectMapper objectMapper;

    public SnakeToCamelResponseBodyAdvice(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request, ServerHttpResponse response) {
        if (body == null || !MediaType.APPLICATION_JSON.includes(selectedContentType)) {
            return body;
        }
        return this.process(body);
    }

    private Object process(Object body) {
        if (body instanceof Map) {
            Map<?, ?> origin = (Map<?, ?>) body;
            Map<String, Object> result = new LinkedHashMap<>();
            for (Map.Entry<?, ?> entry : origin.entrySet()) {
                String key = String.valueOf(entry.getKey());
                Object value = process(entry.getValue());
                result.put(key, value);
                if (isSnakeCase(key)) {
                    String camel = underlineToCamel(key);
                    if (!result.containsKey(camel)) {
                        result.put(camel, value);
                    }
                }
            }
            return result;
        } else if (body instanceof List) {
            List<?> list = (List<?>) body;
            List<Object> result = new ArrayList<>(list.size());
            for (Object item : list) {
                result.add(process(item));
            }
            return result;
        } else if (isPrimitive(body)) {
            return body;
        } else {
            Map<String, Object> map = objectMapper.convertValue(body, new TypeReference<Map<String, Object>>() {
            });
            return process(map);
        }
    }

    private boolean isPrimitive(Object obj) {
        return obj == null || obj instanceof String || obj instanceof Number || obj instanceof Boolean
                || obj instanceof Character;
    }

    private boolean isSnakeCase(String key) {
        return key.contains("_");
    }

    private String underlineToCamel(String key) {
        StringBuilder sb = new StringBuilder();
        boolean upper = false;
        for (char c : key.toCharArray()) {
            if (c == '_') {
                upper = true;
            } else {
                if (upper) {
                    sb.append(Character.toUpperCase(c));
                    upper = false;
                } else {
                    sb.append(c);
                }
            }
        }
        return sb.toString();
    }
}

