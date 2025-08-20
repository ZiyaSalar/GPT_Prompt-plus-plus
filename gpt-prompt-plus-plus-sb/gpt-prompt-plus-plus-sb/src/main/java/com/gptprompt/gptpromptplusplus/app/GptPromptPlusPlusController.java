package com.gptprompt.gptpromptplusplus.app;


import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gptprompt")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class GptPromptPlusPlusController {
    private final GptPromptPlusPlusService gptPromptPlusPlusService;
    @PostMapping("/generate")
    public ResponseEntity<String> generatePrompt(@RequestBody PromptRequest promptRequest){
        String res= gptPromptPlusPlusService.generatePrompt(promptRequest);
        System.out.println("GPT Prompt ++ : "+res);
        return ResponseEntity.ok(res);
    }

}
