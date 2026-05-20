package com.smartcity.fixmystreet;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class WorkerControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(username = "worker@city.com", authorities = {"CITY_WORKER"})
    void testWorkerAccess_AuthorizedUser_ReturnsSuccess() throws Exception {
        mockMvc.perform(get("/api/worker/test"))
                .andExpect(status().isOk())
                .andExpect(content().string("Success!"));
    }

    @Test
    void testWorkerAccess_UnauthenticatedUser_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/worker/test"))
                .andExpect(status().isForbidden());
    }
}