import { Component, OnInit, ViewChild } from '@angular/core';
import { ImageService } from '../../services/image.service';
import { Observable } from 'rxjs';
import { BlogImage } from '../../models/blog-image.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.css']
})
export class ImageSelectorComponent implements OnInit {
  private file?: File;
  filename: string = '';
  title: string = '';
  images$?: Observable<BlogImage[]>;

  //variable to clear form
  @ViewChild('form', { static: false }) imageUploadForm?: NgForm;

  constructor(private imageService: ImageService) {

  }

  ngOnInit(): void {
    this.getImages();
  }

  onFileUploadChange(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    this.file = element.files?.[0]
  }

  uploadImage(): void {
    if (this.file && this.filename !== '' && this.title !== '') {
      //image upload service
      this.imageService.uploadImage(
        this.file, 
        this.filename,
        this.title
      ).subscribe({
        next: (response) => {
          console.log(response);
          this.imageUploadForm?.resetForm();
          this.getImages();
        }
      });
    }
  }

  selectImage(image: BlogImage): void {
    this.imageService.selectImage(image);
  }

  private getImages() {
    this.images$ = this.imageService.getAllImages();
  }


}
