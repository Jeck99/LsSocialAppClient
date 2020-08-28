import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../services/api.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from '../services/auth.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.less']
})
export class AddPostComponent implements OnInit {
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef; files = [];
  userIdFromStorage: string;

  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private formBuilder: FormBuilder,private authService:AuthService) { }
  isAddForm = true;
  title = this.isAddForm ? 'Add New Post' : 'Edit Post';
  myDate = new Date();
  postsForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  newDate = Date.now()
  saveDate: Date;
  id = 0;
  name = '';
  description = '';
  image = '';
  CreationDate: Date;
  Updatedate: Date;
  isLoadingResults = false;
  userId: string = this.userIdFromStorage;
  likes:0;

  ngOnInit(): void {
    this.userIdFromStorage = this.authService.getUserIdFromLocStor();
    this.initPostForm();
  }
  private initPostForm() {
    this.saveDate = new Date(this.newDate);
    this.isAddForm ? this.popNewPostForm() : this.popEditPost();
  }
  private popNewPostForm() {
    this.postsForm = this.formBuilder.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      image: [null],
      CreationDate: [this.saveDate],
      Updatedate: [null],
      userId: [this.userId],
      likes:[0]
    });
  }
  onFormSubmit() {
    this.isLoadingResults = true;
    this.isAddForm ? this.addNewPost() : this.updatePost();
  }
  private popEditPost() {
    this.getPostById(this.route.snapshot.params.id);
    this.postsForm = this.formBuilder.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      CreationDate: [null],
      image: [null],
      userId:[null],
      likes:[0]
    });
  }
  private addNewPost() {
    this.dataService.addNewItemToDb(this.postsForm.value, 'posts')
      .subscribe((res: any) => {
        const id = res.id;
        this.isLoadingResults = false;
        this.router.navigate(['/home']);
      }, (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
      });
  }
  getPostById(id: any) {
    this.dataService.sendGetByIdRequest(id,'posts').subscribe((data: any) => {
      this.id = data.id;
      this.postsForm.setValue({
        name: data.name,
        description: data.description,
        creationDate: data.creationDate,
        updateDate: data.updateDate,
        image: data.image,
        UserId: data.image
      });
    });
  }
  private updatePost() {
    this.dataService.update(this.id, this.postsForm.value, 'posts')
      .subscribe((res: any) => {
        const id = res.id;
        this.isLoadingResults = false;
        this.router.navigate(['/home', id]);
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
