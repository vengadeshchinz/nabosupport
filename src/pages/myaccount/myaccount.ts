import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { NavController, NavParams,ViewController,ToastController,LoadingController } from 'ionic-angular';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation'; 
import {AuthServiceProvider} from '../../providers/auth-service/auth-service';
import {FormGroup, FormControl,Validators} from '@angular/forms';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera,CameraOptions  } from '@ionic-native/camera';
/**
 * Generated class for the MyaccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
@Component({
  selector: 'page-myaccount',
  templateUrl: 'myaccount.html',
})
export class MyaccountPage implements OnInit{
  @ViewChild('map') mapElement: ElementRef;
  imageURI:any;
  imageFileName:any;
  options : GeolocationOptions;
  currentPos : Geoposition;
  map: any;
  LastLng1:any;
  LastLat1:any;
  marker:any;
  userdetail:{};
  editProfile:any;
  autocompleteItems: any;
  autocomplete: any;
  acService:any;
  placesService: any;
  responseData : any;
  isDisable:any;
  isDisabled:any;
  users: any;
  submitProfile:any;
  cancelProfile:any;
  locationdata = {"hus": "", "street": "", "city": ""};
  
  form1= new FormGroup({
    username: new FormControl('',Validators.required),
    mail:new FormControl('',Validators.required),
    password: new FormControl('',Validators.required),
    house:new FormControl('', Validators.required),
    street:new FormControl('', Validators.required),
    pin:new FormControl('', Validators.required),
    city:new FormControl('', Validators.required),
    country:new FormControl('', Validators.required),
    user_id:new FormControl('',Validators.required),
    latitude:new FormControl('',Validators.required),
    longitude:new FormControl('',Validators.required)
  });
  get username(){
    return this.form1.get('username');
  }
  get mail() {
    return this.form1.get('mail');
  }
  get password(){
    return this.form1.get('password');
  }
  get house() {
      return this.form1.get('house');
  }
  get street() {
      return  this.form1.get('street'); 
  }
  get pin() {
      return this.form1.get('pin');
  }
  get city() {
    return this.form1.get('city');
}
get country() {
  return this.form1.get('country');
}
  constructor(
    private transfer: FileTransfer,
    private camera: Camera,
    public navCtrl: NavController,
    public AuthServiceProvider:AuthServiceProvider, 
    public viewCtrl: ViewController, 
    public navParams: NavParams,
    public geolocation: Geolocation,
    private loadingCtrl:LoadingController, 
    private toastCtrl:ToastController) {
  this.get_user();

  this.ionViewDidLoad();
  }

  /*##get login user details Start##*/
  get_user(){
    var userdata= JSON.parse(localStorage.getItem('userData'));
    console.log(userdata['user_id']);
    this.AuthServiceProvider.postData(userdata,'getUser').then((result) => {
    this.responseData = result;
      var user_detail=this.responseData;
      console.log(user_detail[0].latitude+','+user_detail[0].longitude);
      this.userdetail=user_detail;
      this.isDisable=true;
      this.editProfile=true;
      this.submitProfile=false;
      this.cancelProfile=false;
      this.isDisabled=true;
      this.addMap(user_detail[0].longitude,user_detail[0].latitude);
     })
}
 /*##get login user details end##*/
profileactive(){
  this.isDisable=false;
  this.editProfile=false;
  this.submitProfile=true;
  this.cancelProfile=true;
}
profilecancel(){
  this.isDisable=true;
  this.editProfile=true;
  this.submitProfile=false;
  this.cancelProfile=false;
}
profileUpdate(){
  let toast = this.toastCtrl.create({
    message: 'Profile update successfully!!!',
    duration: 3000,
    position: 'bottom'
  });
  let loading = this.loadingCtrl.create({
    spinner: 'crescent',
    content: 'Profile updating...'
  });
  setTimeout(() => {
    loading.dismiss();
  }, 300);
 
  console.log(this.userdetail[0]);
  this.AuthServiceProvider.postData(this.userdetail[0],'updateProfile').then((result) => {
   // loading.present();
    this.responseData = result;
      var user_detail=this.responseData;
      if(true == this.responseData.status){
     // console.log(user_detail[0].longitude+','+user_detail[0].longitude);
      this.userdetail[0]=user_detail;
      this.isDisable=true;
      this.editProfile=true;
      this.submitProfile=false;
      this.cancelProfile=false;
      toast.present();
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
      
      }else{

      }
     // this.addMap(user_detail[0].longitude,user_detail[0].longitude);
     })

}
  ngOnInit() {
    this.acService = new google.maps.places.AutocompleteService();        
    this.autocompleteItems = [];
    this.autocomplete = {
    query: ''
    };        
    }

  dismiss() {
    this.viewCtrl.dismiss();
}

chooseItem(item: any) {
    console.log('modal > chooseItem > item > ', item);
    this.viewCtrl.dismiss(item);
}

updateSearch() {
    console.log('modal > updateSearch');
    if (this.autocomplete.query == '') {
        this.autocompleteItems = [];
        return;
    }
    let self = this;
    let config = { 
        types:  ['geocode'], // other types available in the API: 'establishment', 'regions', and 'cities'
        input: this.autocomplete.query, 
        componentRestrictions: { country: 'AR' } 
    }
    this.acService.getPlacePredictions(config, function (predictions, status) {
        console.log('modal > getPlacePredictions > status > ', status);
        self.autocompleteItems = [];            
        predictions.forEach(function (prediction) {              
            self.autocompleteItems.push(prediction);
        });
    });
}
/*##Map function Start##*/
// getUserPosition(){
//   this.options = {
//        enableHighAccuracy : true
//   };

//    this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {

//        this.currentPos = pos;      
//        console.log(pos.coords.latitude+','+pos.coords.longitude);
//        this.addMap(pos.coords.latitude,pos.coords.longitude);

//    },(err : PositionError)=>{
//       console.log("error : " + err.message);
//    });
// }
 ionViewDidLoad() {
   console.log('ionViewDidLoad MapPage');
  // this.getUserPosition();
 }
  addInfoWindow(marker, content){
   
   let infoWindow = new google.maps.InfoWindow({
     content: content
    });
   
    google.maps.event.addListener(marker, 'click', () => {
     infoWindow.open(this.map, marker);
    });
   
  }
  
 addMap(lat,long){
       let latLng = new google.maps.LatLng(lat, long);
       let mapOptions = {
       center: latLng,
       zoom: 15,
       mapTypeId: google.maps.MapTypeId.ROADMAP,
       styles: [{ "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#dedede" }, { "lightness": 21 }] }, { "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 }] }, { "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#f2f2f2" }, { "lightness": 19 }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#fefefe" }, { "lightness": 20 }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 }] }]
       }
   
       this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
       this.addMarker();
   }
addMarker(){
     
         let marker = new google.maps.Marker({
         map: this.map,
         animation: google.maps.Animation.DROP,
         draggable:true,
         position: this.map.getCenter()
         });
     
         let content = "<p>This is your current position !</p>";          
         let infoWindow = new google.maps.InfoWindow({
         content: content
         });
         this.lastLatLng(marker)
         google.maps.event.addListener(marker, 'click', () => {
         infoWindow.open(this.map, marker);
        });
     }
     lastLatLng(marker){
       let geocoder = new google.maps.Geocoder();
       google.maps.event.addListener(marker, 'dragend', () =>{ 
         this.LastLat1= marker.position.lat();
         this.LastLng1= marker.position.lng();
         let latlng = new google.maps.LatLng(this.LastLat1, this.LastLng1);
         let request = { latLng: latlng };
       console.log(this.LastLat1+','+this.LastLng1);
       geocoder.geocode(request, (results, status) => {
         if (status == google.maps.GeocoderStatus.OK) {
           let result = results[0];
           let rsltAdrComponent = result.address_components;
           console.log(rsltAdrComponent);
           let resultLength = rsltAdrComponent.length;
           if (result != null) {
            // this.marker.buildingNum = rsltAdrComponent[resultLength-8].short_name;
          //  this.marker.streetName = rsltAdrComponent[resultLength-7].short_name;
          var data = new Array;
          var locationdata = new Array();
          for(var i = 0; i < rsltAdrComponent.length; i++) {
            var obj = rsltAdrComponent[i];
            data.push(obj.long_name);
            
          }
        //console.log(locdata);
          if(data.length == 8) {
            this.userdetail[0].street_address=data[0];
            this.userdetail[0].country=data[1];
            this.userdetail[0].city=data[4];
            // var locdata = {
            //                 hus:data[0],
            //                 street:data[1],
            //                 city:data[4]
            //               };
            // locationdata.push(locdata);
            //console.log(locationdata);
          } else if(data.length == 9){
            this.userdetail[0].street_address=data[0];
            this.userdetail[0].country=data[1];
            this.userdetail[0].city=data[3];
                  // var locdata = {
                  //               hus:data[0],
                  //               street:data[1],
                  //               city:data[3]
                  //               };
            // locationdata.push(locdata);
           // console.log(locationdata);
          } else if(data.length == 10){
            this.userdetail[0].street_address=data[0];
            this.userdetail[0].country=data[1];
            this.userdetail[0].city=data[5];
            //       var locdata = {
            //                     hus:data[0],
            //                     street:data[1],
            //                     city:data[5]
            //                     };
            // locationdata.push(locdata);
           // console.log(locationdata);
          }
        
            console.log(this.userdetail);
           } else {
             alert("No address available!");
           }
         }
       });
    });
     }


/*##Map function end##*/
/*##User image upload function Start##*/
presentToast(msg) {
  let toast = this.toastCtrl.create({
    message: msg,
    duration: 3000,
    position: 'bottom'
  });

  toast.onDidDismiss(() => {
    console.log('Dismissed toast');
  });

  toast.present();
}
getImage() {
  const options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
  }

  this.camera.getPicture(options).then((imageData) => {
    this.imageURI = imageData;
  }, (err) => {
    console.log(err);
    //this.presentToast(err);
  });
}

uploadFile() {
  let loader = this.loadingCtrl.create({
    content: "Uploading..."
  });
  loader.present();
  const fileTransfer: FileTransferObject = this.transfer.create();

  let options: FileUploadOptions = {
    fileKey: 'ionicfile',
    fileName: 'ionicfile',
    chunkedMode: false,
    mimeType: "image/jpeg",
    headers: {}
  }

  fileTransfer.upload(this.imageURI, 'http://192.168.0.7:8080/api/uploadImage', options)
    .then((data) => {
    console.log(data+" Uploaded Successfully");
    this.imageFileName = "http://192.168.0.7:8080/static/images/ionicfile.jpg"
    loader.dismiss();
    this.presentToast("Image uploaded successfully");
  }, (err) => {
    console.log(err);
    loader.dismiss();
    this.presentToast(err);
  });
}
/*##User image upload function end##*/

}
