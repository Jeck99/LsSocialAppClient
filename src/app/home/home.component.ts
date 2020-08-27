import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Post } from '../post';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { User } from '../user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  items: Post[]  = [];
  pageOfItems: Array<any>;
  isLoadingResults: boolean;
  userName:any;
  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.userName=this.dataService.getUserNameFromLocStor(this.userName); 
    this.getPosts();
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }
  private getPosts() {
    this.dataService.sendGetPostsRequest()
      .subscribe((res: any) => {
        console.log(res);
        this.items = res;
        console.log(this.items);

        this.isLoadingResults = false;
      }, (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
      });
  }
  updatePost(item:Post){
    // if(item.userId=user.id){}
    
  }
  likeIt(item){return ;}
}
