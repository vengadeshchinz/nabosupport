import { Component } from '@angular/core';
import { ToastController,NavController, NavParams } from 'ionic-angular';
import { EmailComposer} from '@ionic-native/email-composer';
import {AuthServiceProvider} from '../../providers/auth-service/auth-service';
import {FormGroup, FormControl,Validators} from '@angular/forms';
/**
 * Generated class for the ContactusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-contactus',
  templateUrl: 'contactus.html',
})
export class ContactusPage {
  userData = {"name": "", "mail": "","subject":"","message":""};
  responseData:any;
  form= new FormGroup({
    name: new FormControl('',Validators.required),
    mail: new FormControl('',Validators.required),
    subject: new FormControl('',Validators.required),
    message: new FormControl('',Validators.required),
  });
  get name(){
    return this.form.get('name');
  }
  get mail(){
    return this.form.get('mail');
  }
  get subject(){
    return this.form.get('subject');
  }
  get message(){
    return this.form.get('message');
  }
  constructor(public navCtrl: NavController, private toastCtrl:ToastController,public AuthServiceProvider: AuthServiceProvider,public emailComposer:EmailComposer, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactusPage');
  }
sendemail(){
  console.log("mail");
  // this.emailComposer.isAvailable().then((available: boolean) =>{
  //  console.log(available);
  //  if(available) {
  //     //Now we know we can send
  //     console.log("mail1");
  //     let email = {
  //       to: 'vengadeschinz@gmail.com',
  //       cc: 'erika@mustermann.de',
  //       bcc: ['vengadeschinz@gmail.com', 'vengadeschinz@gmail.com'],
  //       attachments: [
        
  //       ],
  //       subject: 'Cordova Icons',
  //       body: 'How are you? Nice greetings from Leipzig',
  //       isHtml: true
  //     };
  //     this.emailComposer.open(email);
  //   }else{
  //     console.log("mailnot");
  //  }
  // });
  console.log(this.userData);
  this.AuthServiceProvider.postData(this.userData,'sendmail').then((result) => {
    this.responseData = result;
    //alert(this.responseData.status+','+this.responseData.msg);
    if(true == this.responseData.status){
      let toast = this.toastCtrl.create({
        message: this.responseData.msg,
        duration: 3000,
        position: 'bottom'
      });
    
      toast.present();
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
    }else{
alert("error");
    }
  }, (err) => {
    // Error log
  });
  
  
}
}
