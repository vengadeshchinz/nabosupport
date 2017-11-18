import { Component } from '@angular/core';
import { ToastController, NavController,LoadingController } from 'ionic-angular';
import { SigninPage} from '../signin/signin';
import {ResetpasswordPage} from '../resetpassword/resetpassword';
import { NgForm} from '@angular/forms';
import {NativeStorage} from '@ionic-native/native-storage';
import {AuthServiceProvider} from '../../providers/auth-service/auth-service';
import {FormGroup, FormControl,Validators} from '@angular/forms';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';


/**
 * Generated class for the ForgotpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html',
})
export class ForgotpasswordPage {

  form1= new FormGroup({
    username: new FormControl(),
    email: new FormControl()
  });
  get username(){
    return this.form1.get('username');
  }
  get email(){
    return this.form1.get('email');
  }
  responseData : any;
  userForgotData = {"username": "", "email": ""};
  constructor(
              public navCtrl: NavController,
              private nativeStorage:NativeStorage,
              private toastCtrl:ToastController,
              private loadingCtrl:LoadingController, 
              public AuthServiceProvider: AuthServiceProvider
              ) {
                localStorage.setItem('userForgotData', "");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotpasswordPage');
  }

  forgot(){
    let toast = this.toastCtrl.create({
      message: 'Invaild Username or Email',
      duration: 3000,
      position: 'bottom'
    });
    let toast1 = this.toastCtrl.create({
      message: 'Please provide a username Or Email',
      duration: 3000,
      position: 'bottom'
    });
    let toast2 = this.toastCtrl.create({
      message: 'Your Account verified..',
      duration: 3000,
      position: 'bottom'
    });
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Authenticating...'
    });
 
    setTimeout(() => {
      loading.dismiss();
    }, 500);

if(this.userForgotData.username || this.userForgotData.email){
  this.AuthServiceProvider.postData(this.userForgotData,'forgotpassword').then((result) => {
  this.responseData = result;
  console.log(result);
  if(true == this.responseData.status){
   // loading.present();
  localStorage.setItem('userForgotData', JSON.stringify(this.responseData));
  //console.log(userForgotData)
  console.log( JSON.parse(localStorage.getItem('userForgotData')));
  toast2.present();
  this.navCtrl.setRoot(ResetpasswordPage);
 // this.navCtrl.push(MapPage);
  }else{
    toast.present();
  }
}, (err) => {
  // Error log
});
}else{
  if(!(this.userForgotData.username)||!(this.userForgotData.email)){
    toast1.present();
  }
 
}
  }

}
