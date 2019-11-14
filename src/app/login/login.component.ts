import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  showSpinner = false;

  constructor(private router: Router) {
    gapi.load('auth2', () => {
      gapi.auth2.init();
    });
  }

  ngOnInit() {  }

  login(): void {
    if (this.username === 'admin' && this.password === 'admin') {
      this.router.navigate(['home']);
    } else {
      alert('Invalid credentials');
    }
  }

  googleLogin() {
    const googleAuth = gapi.auth2.getAuthInstance();
    googleAuth.then(() => {
       googleAuth.signIn({scope: 'profile email'}).then(googleUser => {
          console.log(googleUser.getBasicProfile());
          const profile = googleUser.getBasicProfile();
          console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
          console.log('Name: ' + profile.getName());
          console.log('Image URL: ' + profile.getImageUrl());
          console.log('Email: ' + profile.getEmail());
          this.router.navigate(['home']);
       }, (error) => {
        console.log('Error from signIn()');
        console.log(error);
       });
    }, (error) => {
      console.log('Error from getAuthInstance()');
      console.log(error);
    });
 }

}
