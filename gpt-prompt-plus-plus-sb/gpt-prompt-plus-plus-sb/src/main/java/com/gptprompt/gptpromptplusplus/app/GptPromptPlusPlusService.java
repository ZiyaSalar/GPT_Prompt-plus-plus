package com.gptprompt.gptpromptplusplus.app;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class GptPromptPlusPlusService {

    private final WebClient webClient;
    public GptPromptPlusPlusService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @Value("${gemini.api.url}")
    private String geminiApiUrl;
    @Value("${gemini.api.key}")
    private String geminiApiKey;


    public String generatePrompt(PromptRequest promptRequest){
        // Build the prompt
        String prompt=buildPrompt(promptRequest);

        // craft a request
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
                        })
                }
        );
        String response = webClient.post()
                .uri(geminiApiUrl + geminiApiKey)
                .header("Content-Type","application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        // Extract and return the reply text
        return extractResponseContent(response);
        // return response
    }

    private String extractResponseContent(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);
            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
        } catch (Exception e) {
            return "Error processing request: " + e.getMessage();
        }
    }

    private String buildPrompt(PromptRequest promptRequest) {
        System.out.println("User Prompt : "+promptRequest.getPromptContent());
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are a Prompt Enhancer AI. ")
                .append("Your task is to take the raw user prompt and transform it into a more detailed, structured, and optimized prompt for AI models. ")
                .append("Steps to follow: \n")
                .append("1. Understand the user’s intent clearly. \n")
                .append("2. Expand vague instructions into specific, actionable requests. \n")
                .append("3. Add missing context, examples, or formatting if useful. \n")
                .append("4. Make the prompt clear, concise, and goal-oriented. \n")
                .append("5. Keep the tone aligned with the user’s intent (formal, creative, technical, casual, etc.). \n")
                .append("Don't give any extra context... just give the enhance prompt. \n");
        prompt.append("\nOriginal user prompt:\n").append(promptRequest.getPromptContent());
        System.out.println(prompt);
        return prompt.toString();
    }
}
