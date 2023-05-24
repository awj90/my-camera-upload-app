import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PhotoService } from '../photo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  constructor(
    private photoService: PhotoService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  @ViewChild('fileToUpload')
  fileToUpload!: ElementRef;

  form!: FormGroup;
  public webcamImageUrl!: string;

  ngOnInit(): void {
    if (!this.photoService.webcamImage) {
      alert('Oops, please snap a picture first!');
      this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    }

    this.webcamImageUrl = this.photoService.webcamImage.imageAsDataUrl;

    this.form = this.fb.group({
      comments: this.fb.control<string>('', [Validators.required]),
      file: this.fb.control<string>(this.webcamImageUrl, [Validators.required]),
    });
  }

  process() {
    //const f: File = this.fileToUpload.nativeElement.files[0];
    const f: File = this.dataURLtoFile(this.form.value['file'], uuidv4());
    firstValueFrom(this.photoService.upload(this.form.value['comments'], f))
      .then(() => {
        alert('Successfully uploaded');
        this.form.reset();
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
      })
      .catch((err) => {
        alert(JSON.stringify(err));
      });
  }

  private dataURLtoFile(dataUrl: string, fileName: string) {
    const arr = dataUrl.split(',');
    // alternatively can put // @ts.ignore
    // mime = arr[0].match(/:(.*?);/)[1]
    const mime = arr[0].split(':')[1].split(';')[0];
    let bstr = atob(arr[arr.length - 1]);
    let n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  }
}
