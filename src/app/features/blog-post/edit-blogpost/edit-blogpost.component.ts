import { AfterViewChecked, Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BlogPostService } from '../services/blog-post.service';
import { BlogPost } from '../models/blog-post.model';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category.model';
import { UpdateBlogPost } from '../models/update-blog-post.model';

@Component({
  selector: 'app-edit-blogpost',
  templateUrl: './edit-blogpost.component.html',
  styleUrls: ['./edit-blogpost.component.css']
})
export class EditBlogpostComponent implements OnInit, AfterViewChecked, OnDestroy {

  id: string | null = null;
  model?: BlogPost;
  categories$?: Observable<Category[]>;
  selectedCategories?: string[];
  isImageSelectorVisible: boolean = false;

  routeSubscription?: Subscription;
  getBlogPostSubscription?: Subscription;
  updateBlogPostSubscription?: Subscription;
  deleteBlogPostSubscription?: Subscription;


  @ViewChild('content') content!: ElementRef;
  @ViewChild('markdownPreview') markdownPreview!: ElementRef; 

  constructor(
    private blogPostService: BlogPostService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2

  ) {

  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();

    this.routeSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');

        //get blog from api
        if (this.id) {
          this.getBlogPostSubscription = this.blogPostService.getBlogPostById(this.id).subscribe({
            next: (response) => {
              this.model = response;
              this.selectedCategories = response.categories.map(x => x.id);
            }
          });
        }
      }
    })
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
    //convert model to request object
    if (this.model && this.id) { //id required to update record
      var updateBlogPost: UpdateBlogPost = {
        author: this.model.author,
        content: this.model.content,
        datePublished: this.model.datePublished,
        dateUpdated: this.model.dateUpdated,
        featuredImageUrl: this.model.featuredImageUrl,
        isVisible: this.model.isVisible,
        shortDescription: this.model.shortDescription,
        title: this.model.title,
        urlHandle: this.model.urlHandle,
        categories: this.selectedCategories ?? [] //if null return empty array
      };

      this.updateBlogPostSubscription = this.blogPostService
        .updateBlogPost(this.id, updateBlogPost)
        .subscribe({
          next: (response) => {
            this.router.navigateByUrl('/admin/blogposts');
          }
        })
    }
  }

  onDelete(): void {
    if (this.id) {
      //call service to delete blog
      this.deleteBlogPostSubscription = this.blogPostService
        .deleteBlogPost(this.id)
        .subscribe({
          next: (response) => {
            this.router.navigateByUrl('/admin/blogposts');
        }
      })
    }
  }

  openImageSelector(): void {
    this.isImageSelectorVisible = true;
  }
  closeImageSelector(): void {
    this.isImageSelectorVisible = false;
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.getBlogPostSubscription?.unsubscribe();
    this.updateBlogPostSubscription?.unsubscribe();
    this.deleteBlogPostSubscription?.unsubscribe();
  }
}
