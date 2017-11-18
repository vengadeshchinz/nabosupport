import { Component } from '@angular/core';
import { ToastController, NavController,LoadingController } from 'ionic-angular';
import {ForgotpasswordPage} from '../forgotpassword/forgotpassword';
import { SigninPage} from '../signin/signin';
import { NgForm} from '@angular/forms';
import {NativeStorage} from '@ionic-native/native-storage';
import {AuthServiceProvider} from '../../providers/auth-service/auth-service';
import {FormGroup, FormControl,Validators} from '@angular/forms';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

/**
 * Generated class for the ResetpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-resetpassword',
  templateUrl: 'resetpassword.html',
})
export class ResetpasswordPage {

  form2= new FormGroup({
    password: new FormControl(),
    cpassword: new FormControl()
  });
  get password(){
    return this.form2.get('password');
  }
  get cpassword(){
    return this.form2.get('cpassword');
  }
  responseData : any;
  userResetData = {"user_id": "","password": "", "cpassword": ""};
  constructor(
              public navCtrl: NavController,
              private nativeStorage:NativeStorage,
              private toastCtrl:ToastController,
              private loadingCtrl:LoadingController, 
              public AuthServiceProvider: AuthServiceProvider
              ) {
                localStorage.setItem('userResetData', "");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetpasswordPage');
  }

  reset(){
    let toast = this.toastCtrl.create({
      message: 'Password not matched',
      duration: 3000,
      position: 'bottom'
    });
    let toast1 = this.toastCtrl.create({
      message: 'Please provide Password',
      duration: 3000,
      position: 'bottom'
    });
    let toast2 = this.toastCtrl.create({
      message: 'Your password changed..',
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

if(this.userResetData.password && this.userResetData.cpassword){
  if(this.userResetData.password != this.userResetData.cpassword) {
     toast.present();
  } else {
    var userdata= JSON.parse(localStorage.getItem('userForgotData'));
    this.userResetData.user_id = userdata.user_id;
    this.AuthServiceProvider.postData(this.userResetData,'resetpassword').then((result) => {
      this.responseData = result;
      console.log(result);
      if(true == this.responseData.status){
       // loading.present();
      localStorage.setItem('userResetData', JSON.stringify(this.responseData));
      //console.log(userForgotData)
      console.log( JSON.parse(localStorage.getItem('userResetData')));
      toast2.present();
      this.navCtrl.setRoot(SigninPage);
     // this.navCtrl.push(MapPage);
      }else{
        toast.present();
      }
    }, (err) => {
      // Error log
    });
  }
  
}else{
  if(!(this.userResetData.password)||!(this.userResetData.cpassword)){
    toast1.present();
  }
 
}
  }

}
