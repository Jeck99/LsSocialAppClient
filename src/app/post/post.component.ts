import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.less']
})
export class PostComponent implements OnInit {

  constructor() { }
  @Input() post: Post;
  @Input() userId: string;
  ngOnInit(): void {
  }
  likeIt(item) { return; }
  updatePost(item:Post){
    // if(item.userId=user.id){}
    
  }
}
