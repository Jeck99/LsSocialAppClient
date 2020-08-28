import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../services/api.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MyErrorStateMatcher } from '../add-post/add-post.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private formBuilder: FormBuilder) { }
  isLoadingResults: boolean = false;
  isLoginForm: boolean = true;
  title: string = this.isLoginForm ? 'Login' : 'Register';
  matcher = new MyErrorStateMatcher();
  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });
  ngOnInit(): void {

  }
  toggle() {
    this.isLoginForm = !this.isLoginForm;
    console.log(this.isLoginForm);

  }
  submit() {
    this.isLoadingResults = true;
    this.isLoginForm ? this.login() : this.register();
  }
  private register() {
    this.dataService.regisrer(this.form.value)
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
  private login() {
    this.dataService.login(this.form.value)
      .subscribe((res: any) => {
        console.log(res);
        this.isLoadingResults = false;
        this.router.navigate(['/home']);
      }, (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
      });
  }
}
