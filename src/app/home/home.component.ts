import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/api.service';
import { Post } from '../post';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { User } from '../user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  items: Post[] = [];
  pageOfItems: Array<any>;
  isLoadingResults: boolean;
  userName: string;
  userId: string;
  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private formBuilder: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserIdFromLocStor();
    this.userName = this.authService.getUserNameFromLocStor();

    this.getPosts();
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }
  private getPosts() {
    this.dataService.sendGetRequest('posts')
      .subscribe((res: any) => {
        this.items = res;
        this.isLoadingResults = false;
      }, (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
      });
  }
  updatePost(item: Post) {
    // if(item.userId=user.id){}

  }
}
