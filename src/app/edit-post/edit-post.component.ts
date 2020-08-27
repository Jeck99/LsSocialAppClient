import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../add-post/add-post.component';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.less']
})
export class EditPostComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private formBuilder: FormBuilder) { }

  PostsForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  id=0;
  name = '';
  description = '';
  image = '';
  creationDate: Date;
  updateDate: Date;
  newDate = Date.now()  
  saveDate: Date;
  isLoadingResults = false;

  ngOnInit(): void {
    this.popPostFields();
  }
  private popPostFields() {
    this.getPostById(this.route.snapshot.params.id);
    this.PostsForm = this.formBuilder.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      CreationDate: [null, Validators.required],
      image: [null, Validators.required]
    });
  }

  getPostById(id: any) {
    this.dataService.getPostById(id).subscribe((data: any) => {
      this.id = data.id;
      this.PostsForm.setValue({
        name: data.name,
        description: data.description,
        creationDate: data.creationDate,
        updateDate: data.updateDate,
        image: data.image,
        UserId: data.image
      });
    });
  }
  onFormEditSubmit() {
    this.isLoadingResults = true;
    this.dataService.updatePost(this.id, this.PostsForm.value)
      .subscribe((res: any) => {
          const id = res.id;
          this.isLoadingResults = false;
          this.router.navigate(['/post-details', id]);
        }, (err: any) => {
          console.log(err);
          this.isLoadingResults = false;
        }
      );
  }
  showPostDetails() {
    this.router.navigate(['/post-details', this.id]);
  }
}
