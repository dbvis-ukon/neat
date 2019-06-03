import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'dbvis-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.less']
})
export class WelcomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onSubmitted() {
    console.log('navigate');
    this.router.navigate(['/groups']);
  }

}
