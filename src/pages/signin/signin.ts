import { Component } from '@angular/core';
import { ToastController, NavController,LoadingController } from 'ionic-angular';
import {ForgotpasswordPage} from '../forgotpassword/forgotpassword';
import { SignupPage} from '../signup/signup';
import { MapPage} from '../map/map';
import { AboutPage } from '../about/about';
import {MyaccountPage} from '../myaccount/myaccount';
import { NgForm} from '@angular/forms';
import { GooglePlus } from '@ionic-native/google-plus';
import {NativeStorage} from '@ionic-native/native-storage';
import {AuthServiceProvider} from '../../providers/auth-service/auth-service';
import {FormGroup, FormControl,Validators} from '@angular/forms';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';
declare var google;
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html'
})

export class SigninPage{
  //isLoggedIn:boolean = false;
  users: any;
  options : GeolocationOptions;
  currentPos : Geoposition;
  map: any;
  LastLng1:any;
  LastLat1:any;
  form= new FormGroup({
    username: new FormControl('',Validators.required),
    password: new FormControl('',Validators.required)
  });
  get username(){
    return this.form.get('username');
  }
  get password(){
    return this.form.get('password');
  }
  responseData : any;
  isLoggedIn:any;
  userData = {"username": "", "password": ""};
  locdata:any;
  userFBData:any;
  userGoogleData:any;
  userallData:any;
  data:any;
  displayName: any;
  email: any;
  familyName: any;
  givenName: any;
  userId: any;
  imageUrl: any;
  constructor(
    public navCtrl: NavController,
    private facebook:Facebook,
    private toastCtrl:ToastController,
    private googlePlus:GooglePlus,
    private nativeStorage:NativeStorage,
    public geolocation: Geolocation,
    private loadingCtrl:LoadingController, 
    public AuthServiceProvider: AuthServiceProvider) {
      localStorage.setItem('userData', "");
      localStorage.setItem('userFBData', "");
      localStorage.setItem('userGoogleData',"");
      this.getUserPosition();
      this.FBlogout();
      this.Googlelogout();

  }
  
   /*##facebook login function starts##*/
  // loginWithFB() {
  //   this.facebook.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
  //     this.facebook.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
  //       this.users = {email: profile['email'], first_name: profile['first_name'], picture: profile['picture_large']['data']['url'], username: profile['name']}
  //    console.log("fb"+this.users);
  //    this.navCtrl.push(MapPage);
  //     });
  //   });
  // }


  FBlogin() {
    this.facebook.login(['public_profile', 'user_friends', 'email'])
      .then(res => {     
        if(res.status === "connected") {
          this.isLoggedIn = true;
          this.getUserDetail(res.authResponse.userID);
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }
  getUserDetail(userid) {
    let toast = this.toastCtrl.create({
      message: 'Unverified user details',
      duration: 3000,
      position: 'bottom'
    });
    let toast1 = this.toastCtrl.create({
      message: 'Login successfully!!!',
      duration: 3000,
      position: 'bottom'
    });
    let toast2 = this.toastCtrl.create({
      message: 'Login Failed',
      duration: 3000,
      position: 'bottom'
    });
    function jsonConcat(o1, o2) {
      for (var key in o2) {
       o1[key] = o2[key];
      }
      return o1;
     }
    this.facebook.api("/"+userid+"/?fields=id,email,name,picture,gender",["public_profile"])
      .then(res => {
        console.log(res);
        this.users = res;
        localStorage.setItem('userFBData', JSON.stringify(this.users));
        this.userFBData = JSON.parse(localStorage.getItem('userFBData'));
        //console.log(this.userFBData);
        this.userallData = {};
        this.userallData = jsonConcat(this.locdata,this.userFBData);
        console.log(this.userallData);
        if(this.userallData.email){
            //loading.present();
            this.AuthServiceProvider.postData(this.userallData, 'FBlogin').then((result) => {
              this.responseData = result;
              if(this.responseData.status == true){
              console.log(this.responseData);
                //toast1.present();
                //this.navCtrl.setRoot(MapPage);
                
                   localStorage.setItem('userData', JSON.stringify(this.responseData));
                   this.fbsuccess();
                //console.log(this.responseData.status);
              }else{
                toast2.present();
              }
            }, (err) => {
              // Error log
            });
          }else{
            
              // this.keyboard.show();
            toast.present();
          }
      })
     // .catch(e => {       console.log(e);      });
  }
  FBlogout() {
    this.facebook.logout()
    .then( res => this.isLoggedIn = false)
    .catch(e => console.log('Error logout from Facebook', e));
  }
  /*##facebook login function end##*/

  /*##login function starts##*/
  signin(){
    let toast = this.toastCtrl.create({
      message: 'Invaild Username or Password',
      duration: 3000,
      position: 'bottom'
    });
    let toast1 = this.toastCtrl.create({
      message: 'Please provide a username & password',
      duration: 3000,
      position: 'bottom'
    });
    let toast2 = this.toastCtrl.create({
      message: 'Please provide a username ',
      duration: 3000,
      position: 'bottom'
    });
    let toast3 = this.toastCtrl.create({
      message: 'Please provide a password',
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

if(this.userData.username && this.userData.password){
  this.AuthServiceProvider.postData(this.userData,'login').then((result) => {
  this.responseData = result;
  
  if(true == this.responseData.status){
   // loading.present();
  localStorage.setItem('userData', JSON.stringify(this.responseData));
  //console.log(userData)
  console.log( JSON.parse(localStorage.getItem('userData')));
  this.navCtrl.setRoot(MapPage);
 // this.navCtrl.push(MapPage);
  }else{
    toast.present();
  }
}, (err) => {
  // Error log
});
}else{
  if(!(this.userData.username)&&!(this.userData.password)){
    toast1.present();
  }else{
    if(((this.userData.username)||!(this.userData.password))){
      toast3.present();
       }else{
        toast2.present();
       }
  }
 
}
  }
/*##login function end##*/

/*##google login function starts##*/
  doGoogleLogin(){
    let toast = this.toastCtrl.create({
      message: 'Unverified user details',
      duration: 3000,
      position: 'bottom'
    });
    let toast1 = this.toastCtrl.create({
      message: 'Login successfully!!!',
      duration: 3000,
      position: 'bottom'
    });
    let toast2 = this.toastCtrl.create({
      message: 'Login Failed',
      duration: 3000,
      position: 'bottom'
    });
    function jsonConcat(o1, o2) {
      for (var key in o2) {
       o1[key] = o2[key];
      }
      return o1;
     }
    this.googlePlus.login({})
    .then(res => {
      //console.log(res);
      this.displayName = res.displayName;
      this.email = res.email;
      this.familyName = res.familyName;
      this.givenName = res.givenName;
      this.userId = res.userId;
      this.imageUrl = res.imageUrl;

      localStorage.setItem('userGoogleData', JSON.stringify(res));
      this.userGoogleData = JSON.parse(localStorage.getItem('userGoogleData'));
      //console.log(this.userFBData);
      this.userallData = {};
      this.userallData = jsonConcat(this.locdata,this.userGoogleData);
      //console.log(this.userallData);
      if(this.userallData.email){
        //loading.present();
        this.AuthServiceProvider.postData(this.userallData, 'FBlogin').then((result) => {
          this.responseData = result;
          console.log(this.responseData.status);
          if(this.responseData.status == true){
          console.log(this.responseData);
            //toast1.present();
           // this.navCtrl.push(MapPage);
           localStorage.setItem('userData', JSON.stringify(this.responseData));
            this.fbsuccess();
          //  this.navCtrl.setRoot(MapPage);
              
            //console.log(this.responseData.status);
          }else{
            toast2.present();
          }
        }, (err) => {
          // Error log
        });
      }else{
        
          // this.keyboard.show();
        toast.present();
      }
    })
   // .catch(err => console.error(err));
  }
  Googlelogout() {
    this.googlePlus.logout()
      .then(res => {
        console.log(res);
        this.displayName = "";
        this.email = "";
        this.familyName = "";
        this.givenName = "";
        this.userId = "";
        this.imageUrl = "";

        this.isLoggedIn = false;
      })
      .catch(err => console.error(err));
  }
/*##google login function end##*/
forgot(){
  //forgotpassword page link
  this.navCtrl.push(ForgotpasswordPage);
}
  signup(){
    //Login page link
    this.navCtrl.push(SignupPage);
  }
  account(){
    //Login page link
    this.navCtrl.push(MyaccountPage);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SigninPage');
    this.getUserPosition();
  }

  fbsuccess(){
    //alert("success");
    this.navCtrl.setRoot(MapPage);
  }

   /*##Map function Start##*/
getUserPosition(){
  let geocoder = new google.maps.Geocoder();
  this.options = {
       enableHighAccuracy : true
  };

   this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {
   
       this.currentPos = pos;
       var coord = new Array();
       coord.push(pos.coords.latitude,pos.coords.longitude);      
      // console.log(pos);
      // this.addMap(pos.coords.latitude,pos.coords.longitude);
      let latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      let request = { latLng: latlng };
      geocoder.geocode(request, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          let result = results[0];
          let rsltAdrComponent = result.address_components;
          //console.log(rsltAdrComponent);
          let resultLength = rsltAdrComponent.length;
          if (result != null){
            // this.marker.buildingNum = rsltAdrComponent[resultLength-8].short_name;
          //  this.marker.streetName = rsltAdrComponent[resultLength-7].short_name;
          var data = new Array;
          var locationdata = new Array();
          for(var i = 0; i < rsltAdrComponent.length; i++) {
            var obj = rsltAdrComponent[i];
            data.push(obj.long_name);
            
          }
        //console.log(locdata);
        if(data.length == 6) {
          this.locdata = {
                         "houseno":data[0],
                          "street_address":data[1],
                          "city":data[3],
                          "country":data[4],
                          "zipcode":data[5],
                          "latitude":coord[0],
                          "longitude":coord[1],
                          "is_active":1,
                          "status_id":0
                        };
                        //this.locArray = JSON.parse(JSON.stringify(this.locdata));
          // console.log(this.locdata);
                      }
          else if(data.length == 8) {
            this.locdata = {
                           "houseno":data[0],
                            "street_address":data[1],
                            "city":data[3],
                            "country":data[6],
                            "zipcode":data[7],
                            "latitude":coord[0],
                            "longitude":coord[1],
                            "is_active":1,
                            "status_id":0
                          };
                          //this.locArray = JSON.parse(JSON.stringify(this.locdata));
            // console.log(this.locdata);
          } else if(data.length == 9){
                  this.locdata = {
                    "houseno":data[0],
                    "street_address":data[1],
                    "city":data[3],
                    "country":data[6],
                    "zipcode":data[7],
                    "latitude":coord[0],
                    "longitude":coord[1],
                    "is_active":1,
                    "status_id":0
                                };
            
            // console.log(this.locdata);
          } else if(data.length == 10){

                  this.locdata = {
                    "houseno":data[0],
                    "street_address":data[1],
                    "city":data[3],
                    "country":data[6],
                    "zipcode":data[7],
                    "latitude":coord[0],
                    "longitude":coord[1],
                    "is_active":1,
                    "status_id":0
                                };
            
            // console.log(this.locdata);
          }                
            //this.locArray = JSON.parse(JSON.stringify(this.locdata));
           console.log(this.locdata);
           return this.locdata;
          //console.log(this.userData);
} else {
    alert("No address available!");
  }
        }
      });
   },(err : PositionError)=>{
      console.log("error : " + err.message);
   });
}
 
/*##Map function end##*/
}
