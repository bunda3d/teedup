import { Component } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { BlogPostService } from '../services/blog-post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-blogpost',
  templateUrl: './add-blogpost.component.html',
  styleUrls: ['./add-blogpost.component.css']
})
export class AddBlogpostComponent {
  model: AddBlogPost;

  constructor(private blogPostService: BlogPostService,
    private router: Router) {
    this.model = {
      title: '', 
      shortDescription: '',
      urlHandle: '', 
      content: '',
      featuredImageUrl: '',
      author: '',
      isVisible: true,
      datePublished: new Date(),
      dateUpdated: new Date()
    }
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
