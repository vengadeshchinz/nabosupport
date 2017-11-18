import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
/**
 * Generated class for the ContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {
  mycontact: any;
  responseData: any;
  user_id: any
  contactdetail: any;
  itemsList: any;
  userData = { "name": "", "address": "", "mail": "", "phone": "" };
  form = new FormGroup({
    userid: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    mail: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]),
  });
  get userid() {
    return this.form.get('userid');
  }
  get name() {
    return this.form.get('name');
  }
  get mail() {
    return this.form.get('mail');
  }
  get address() {
    return this.form.get('address');
  }
  get phone() {
    return this.form.get('phone');
  }
  constructor(public navCtrl: NavController, private toastCtrl: ToastController, public navParams: NavParams, public AuthServiceProvider: AuthServiceProvider) {
    this.mycontact = "contact";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactPage');
    var userdata = JSON.parse(localStorage.getItem('userData'));

    // console.log(this.userData);
    //console.log(this.userData);
    this.AuthServiceProvider.postData(userdata, 'getMycontact').then((result) => {
      this.responseData = result;
      console.log(this.responseData);
      this.itemsList=this.responseData;
    }, (err) => {
      // Error log
    });

  }
  contact() {
    let toast = this.toastCtrl.create({
      message: 'Contact added successfully!!!',
      duration: 3000,
      position: 'bottom'
    });
    let toast1 = this.toastCtrl.create({
      message: 'Please fillup the detail to sign up',
      duration: 3000,
      position: 'bottom'
    });
    var userdata = JSON.parse(localStorage.getItem('userData'));
    this.userData['user_id'] = userdata['user_id'];
    console.log(this.userData);
    console.log(this.userData);
    if(this.userData.name && this.userData.mail && this.userData.phone && this.userData.address){
    this.AuthServiceProvider.postData(this.userData, 'mycontact').then((result) => {
      this.responseData = result;
      if (true == this.responseData.status) {
        console.log(this.responseData);
        toast.present();

        this.navCtrl.setRoot(this.navCtrl.getActive().component);
      }

    }, (err) => {
      // Error log
    });
  }else{
    toast1.present();
  }
  }
}
