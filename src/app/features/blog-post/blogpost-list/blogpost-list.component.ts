import { Component, OnInit } from '@angular/core';
import { BlogPostService } from '../services/blog-post.service';
import { Observable } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';

@Component({
  selector: 'app-blogpost-list',
  templateUrl: './blogpost-list.component.html',
  styleUrls: ['./blogpost-list.component.css']
})
export class BlogpostListComponent implements OnInit {

  //create observable var to subscribe to
  blogPosts$?: Observable<BlogPost[]>;
  
  constructor(private blogPostService: BlogPostService) {
    //constructor to inject the service
  }

  ngOnInit(): void { 
    //get all blogs from api using async pipe subscription to handle sub/unsub since it's readonly (not binding to form inputs)
    this.blogPosts$ = this.blogPostService.getAllBlogPosts();
  }
}
