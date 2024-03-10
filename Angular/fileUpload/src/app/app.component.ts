import { HttpClient, HttpClientModule, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HttpClientModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'fileUpload';
  percentDone:number=0;
  count:number=0;
  uploadChunkSize:number=1024*1024;
  uploadStatus:any="";
  FileId:string="HDEHBFEDBE";
  constructor(private http: HttpClient) { }

  onFileChanged(event:any) {
    const file = event.target.files[0];
    this.uploadFileInChunck(file);
  }

  uploadFile(file: File) {
    this.count = 0;
    const formData = new FormData();
    formData.append('file', file,file.name);

    const uploadUrl = 'http://localhost:5000/upload/'+this.FileId;
    const req = this.http.post(uploadUrl, formData, {
      reportProgress: true,
      observe: 'events' // This allows us to handle progress events
    });

    req.subscribe(event => {
      this.count++;
      if (event.type === HttpEventType.UploadProgress) {
        if(event && event.total)
        {
          this.percentDone = Math.round(100 * event.loaded / (event.total));
          console.log(`File is ${this.percentDone}% uploaded.`);
        }
      } else if (event instanceof HttpResponse) {
        console.log('File uploaded successfully!', event.body);
      }
    }, error => {
      console.error('Error uploading file:', error);
    });
  }

  uploadFileInChunck(file: File)
  {
    let start = 0;

    const uploadNextChunk = () => {
      const chunk = file.slice(start, start + this.uploadChunkSize);
      const formData = new FormData();

      let sequence_Number = (Math.ceil(start/this.uploadChunkSize)).toString();

      // Create a Blob from the file content without headers
      const fileBlob = new Blob([chunk], { type: file.type });
      formData.append('file', fileBlob, file.name);

      const uploadUrl = 'http://localhost:5000/upload/'+this.FileId;
      const req = this.http.post(uploadUrl,formData,{
        params: {sequence_Number:sequence_Number},
        reportProgress: true,
        observe: 'events',
      });
  
      req.subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            // this.percentDone = Math.round(100 * event.loaded / event.total);
            this.percentDone = (start/file.size)*100;
          } else if (event instanceof HttpResponse) {
            start += this.uploadChunkSize;
            if (start < file.size) {
              uploadNextChunk();
            }
            else
            {
              this.percentDone = (start/file.size)*100;
              const uploadUrl = 'http://localhost:5000/uploadCompleted/'+this.FileId;
              this.http.get(uploadUrl).subscribe((data)=>{
                console.log(data);
                this.uploadStatus = data;
              },(error)=>{
                this.uploadStatus = error;
                console.log(error);
              });
            }
          }
        },
        error => {
          console.error('Error uploading chunk:', error);
        }
      );
    };

    uploadNextChunk();
  }
}
