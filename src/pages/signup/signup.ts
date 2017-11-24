import { Component,ElementRef,Renderer,ViewChild } from '@angular/core';
import { ToastController, NavController,LoadingController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http'
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';

import { SigninPage } from '../signin/signin';
/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})

export class SignupPage {
 // @ViewChild('map') mapElement: ElementRef;
  options : GeolocationOptions;
  currentPos : Geoposition;
  map: any;
  LastLng1:any;
  LastLat1:any;
  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    mail: new FormControl('', [Validators.required, Validators.email])
  });
  get username() { 
    return this.form.get('username');

  }
  get mail() {
    return this.form.get('mail');
  }
  get password() {
    return this.form.get('password');
  }
  userallData:any;
  locdata:any;
  locArray:any;
  responseData: any;
  userData = { "username": "", "email_id": "", "password": "" };
  constructor(
    public navCtrl: NavController,
    private renderer: Renderer, 
    private elementRef: ElementRef,
    public keyboard: Keyboard,
    public AuthServiceProvider: AuthServiceProvider,
    private loadingCtrl:LoadingController, 
    private toastCtrl:ToastController,
    public geolocation: Geolocation,
    public http: Http) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.ionViewDidLoad();
  }

 /*##signup function starts##*/
  signup() {
    let toast = this.toastCtrl.create({
      message: 'Please fillup the detail to sign up',
      duration: 3000,
      position: 'bottom'
    });
    let toast1 = this.toastCtrl.create({
      message: 'Account created successfully!!!',
      duration: 3000,
      position: 'bottom'
    });
    let toast2 = this.toastCtrl.create({
      message: 'User already exist',
      duration: 3000,
      position: 'bottom'
    });
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Signin you up...'
    });
 
    setTimeout(() => {
      loading.dismiss();
    }, 300);
    function jsonConcat(o1, o2) {
      for (var key in o2) {
       o1[key] = o2[key];
      }
      return o1;
     }
    this.userallData = {};
    console.log(this.locdata);
    this.userallData = jsonConcat(this.userData,this.locdata);
    console.log(this.userallData);
    if(this.userallData.username && this.userallData.password && this.userallData.email_id){
      loading.present();
      this.AuthServiceProvider.postData(this.userallData, 'signup').then((result) => {
        this.responseData = result;
        if(true == this.responseData.status){
       // console.log(this.responseData);
          toast1.present();
          this.navCtrl.push(SigninPage);
            // localStorage.setItem('userData', JSON.stringify(this.responseData));
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
   
}
/*##signup function end##*/

  login() {
    //Login page link
    this.navCtrl.push(SigninPage);
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
      console.log(coord[0]+','+coord[1]);
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
          console.log(this.locdata);
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
            console.log(this.locdata);
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
            
            console.log(this.locdata);
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
            
            console.log(this.locdata);
          }                
            //this.locArray = JSON.parse(JSON.stringify(this.locdata));
          console.log(this.locdata);
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
 ionViewDidLoad() {
   console.log('ionViewDidLoad MapPage');
   this.getUserPosition();
 }
/*##Map function end##*/

}
