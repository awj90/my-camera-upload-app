package sg.edu.nus.iss.server.repositories;

import java.io.IOException;
import java.net.URL;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.PutObjectResult;

@Repository
public class SpacesRepository {
    
    @Autowired
    private AmazonS3 s3;

    public URL upload(String comments, MultipartFile file) throws IOException {
        // Add custom user metadata
        Map<String, String> userData = new HashMap<>();
        userData.put("comments", comments);
        userData.put("filename", file.getOriginalFilename());
        userData.put("upload-date", (new Date()).toString());

        // Add object's metadata (mandatory especially for contentType, optional for contentLength but recommended for improved performance)
        ObjectMetadata metadata = new ObjectMetadata(); 
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());
        metadata.setUserMetadata(userData);

        // PutObjectRequest takes in a few arguments, first the S3 bucket name on digitalocean, next a key which is the file name that the file will be saved as in the bucket, followed by an inputstream and the metadata
        String key = UUID.randomUUID().toString().substring(0, 8); // usually, the key is some unique string so that the file that is uploaded does not override any existing file in the bucket that has a same key. The file's original name if desired can be accessed from the metadata. This key may also begin with a '/foldername/<UUID>', and digitalocean will display the s3 as though as there are folders/directory, although the key to the file still needs to include the '/foldername/'
        PutObjectRequest putReq = new PutObjectRequest("awj90", key, file.getInputStream(), metadata);

        // make the file publicly read accessible from the bucket
        putReq = putReq.withCannedAcl(CannedAccessControlList.PublicRead);
        
        PutObjectResult result = s3.putObject(putReq);
        System.out.printf(">>> result: %s\n", result);

        return s3.getUrl("awj90", key);
    }
}
