package com.xoxoisme.watched;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class WatchedApplication {

	public static void main(String[] args) {
		SpringApplication.run(WatchedApplication.class, args);
	}

}
