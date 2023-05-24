package sg.edu.nus.iss.server.controllers;

import java.io.IOException;
import java.net.URL;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import sg.edu.nus.iss.server.repositories.SpacesRepository;

@Controller
@RequestMapping
@CrossOrigin(origins="*")
public class UploadController {

    @Autowired
    private SpacesRepository spacesRepository;

	@PostMapping(path="/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@ResponseBody
	public ResponseEntity<String> postUpload(@RequestPart String comments
			, @RequestPart MultipartFile file) {

		System.out.printf(">>> title: %s\n", comments);
		System.out.printf(">>> filename: %s\n", file.getOriginalFilename());

        try {
            URL url = spacesRepository.upload(comments, file);
            System.out.printf(">>>> URL: %s\n", url.toString());
        } catch (IOException ex) {
            ex.printStackTrace();;
        }
        return ResponseEntity.ok("{}");
	}
}