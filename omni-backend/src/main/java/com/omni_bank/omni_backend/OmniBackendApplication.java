package com.omni_bank.omni_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class OmniBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(OmniBackendApplication.class, args);
	}

}
