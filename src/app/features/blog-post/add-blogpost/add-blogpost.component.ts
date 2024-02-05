import { Component, ViewChild, ElementRef, Renderer2, AfterViewChecked, HostListener, OnInit } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { BlogPostService } from '../services/blog-post.service';
import { Router } from '@angular/router';
import { Category } from '../../category/models/category.model';
import { CategoryService } from '../../category/services/category.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-blogpost',
  templateUrl: './add-blogpost.component.html',
  styleUrls: ['./add-blogpost.component.css']
})
export class AddBlogpostComponent implements OnInit, AfterViewChecked {
  model: AddBlogPost;
  categories$?: Observable<Category[]>; 
  @ViewChild('content') content!: ElementRef;
  @ViewChild('markdownPreview') markdownPreview!: ElementRef; 

  constructor(
    private blogPostService: BlogPostService,
    private categoryService: CategoryService,
    private router: Router,
    private renderer: Renderer2
    ) {
    this.model = {
      title: '', 
      shortDescription: '',
      urlHandle: '', 
      content: '',
      featuredImageUrl: '',
      author: '',
      isVisible: true,
      datePublished: new Date(),
      dateUpdated: new Date(),
      categories: []
    }
    console.log('constructor executed');
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();
  }

  ngAfterViewChecked() {
    this.matchDivHeightToTextarea();
  }

  @HostListener('window:mouseup')
  onResize(textarea: HTMLTextAreaElement) {
    this.matchDivHeightToTextarea();
  }

  matchDivHeightToTextarea() {
    const textareaHeight = this.content.nativeElement.scrollHeight;
    this.renderer.setStyle(this.markdownPreview.nativeElement, 'height', `${textareaHeight}px`);
  }

  onFormSubmit(): void {
    this.blogPostService.createBlogPost(this.model)
      .subscribe({
        next: (response) => {
          this.router.navigateByUrl('/admin/blogposts')
          console.log('Successful submit of BlogPost data: ', this.model)
        },
        error: (error) => {
          console.log('Failure to submit BlogPost data: ', this.model)
        }
      });
  }
}
