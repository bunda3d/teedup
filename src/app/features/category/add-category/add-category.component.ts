import { Component, OnDestroy } from '@angular/core';
import { AddCategoryRequest } from '../models/add-category-request.model';
import { CategoryService } from '../services/category.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnDestroy {

  model: AddCategoryRequest;
  private addCategorySubscription?: Subscription;

  constructor(private categoryService: CategoryService) {
    this.model = {
      name: '',
      urlHandle: ''
    };
  }

  onFormSubmit() {
    this.addCategorySubscription = this.categoryService.addCategory(this.model)
    .subscribe({
      next: (response) => {
        console.log('Successful submit of Category data: ', this.model)
      },
      error: (error) => {
        console.log('Failure to submit Category data: ', this.model)
      }
    })
  }

  ngOnDestroy(): void {
    //unsubscribe subscriptions to prevent memory leaks
    this.addCategorySubscription?.unsubscribe();
  }
}
