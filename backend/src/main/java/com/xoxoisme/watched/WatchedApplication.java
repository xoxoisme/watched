package com.xoxoisme.watched;

import com.xoxoisme.watched.global.config.AnthropicProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
@EnableConfigurationProperties(AnthropicProperties.class)
public class WatchedApplication {

	public static void main(String[] args) {
		SpringApplication.run(WatchedApplication.class, args);
	}

}
