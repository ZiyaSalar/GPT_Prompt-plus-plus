package com.gptprompt.gptpromptplusplus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GptPromptPlusPlusSbApplication {

	public static void main(String[] args) {
        System.out.println("Backend is Started at port 8080");

        SpringApplication.run(GptPromptPlusPlusSbApplication.class, args);
	}

}
