import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Observable } from 'rxjs';

@Injectable()
export class PhotoService {
  constructor(private http: HttpClient) {}

  // latest snapshot
  public webcamImage!: WebcamImage;

  upload(comments: string, file: File): Observable<any> {
    const formData = new FormData();
    // @RequestPart String comments in Springboot
    formData.set('comments', comments);
    // @RequestPart MultipartFile file in Springboot
    formData.set('file', file);

    return this.http.post<any>('/upload', formData);
  }
}
