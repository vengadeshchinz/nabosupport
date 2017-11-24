import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { POINTER_EVENT_TYPE_MOUSE } from 'ionic-angular/gestures/pointer-events';
/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  @ViewChild('map') mapElement: ElementRef;
 
  out_of_home: any;
  dnd: any;
 
  setData: any;
  responsedata:any;
  responseData: any;
  options: GeolocationOptions;
  currentPos: Geoposition;
  userallData: any;
  currentregional: any;
  valueData: any;
  map: any;
  submitProfile: any;
  range: any;
  nearData: any
  constructor(
    public navCtrl: NavController,
    public AuthServiceProvider: AuthServiceProvider,
    public geolocation: Geolocation,
    public navParams: NavParams) {
    this.get_user();
  }
  get_user() {
    var userdata = JSON.parse(localStorage.getItem('userData'));
    console.log(userdata['user_id']);
    this.AuthServiceProvider.postData(userdata, 'getUser').then((result) => {
      this.responseData = result;
      var user_detail = this.responseData;
      console.log(user_detail[0].latitude + ',' + user_detail[0].longitude);
this.out_of_home=user_detail[0].out_of_home;
if(user_detail[0].do_not_distrub==1){
  this.dnd=true;
}

this.range=user_detail[0].distance;
      this.addMap(user_detail[0].latitude, user_detail[0].longitude);
    })
  }
  addMap(lat, long) {
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

  addMarker() {
    let nabo_img = 'http://rayi.in/naboApi/mapicon/nabo_home.png';
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,

      position: this.map.getCenter(),
      icon: nabo_img,
    });

    let content = "<p>This is your current position !</p>";
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    //this.lastLatLng(marker)
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }

  rangeUser(event) {
    this.submitProfile = true;
    var simpleObject = {};
    for (var prop in event) {
      if (!event.hasOwnProperty(prop)) {
        continue;
      }
      if (typeof (event[prop]) == 'object') {
        continue;
      }
      if (typeof (event[prop]) == 'function') {
        continue;
      }
      simpleObject[prop] = event[prop];
    }
    var value = JSON.stringify(simpleObject);
    this.valueData = JSON.parse(value)._value;
    var user_detail = this.responseData;
    user_detail[0]['valuedata'] = this.valueData;
    this.AuthServiceProvider.postData(user_detail[0], 'getNearuser').then((result) => {
      this.nearData = result;
      
      this.nearData.forEach(function (o) {
        Object.keys(o).forEach(function (k) {
          if (isFinite(o[k])) {
            o[k] = +o[k];
          }
        });
      });
      console.log(this.nearData);
      if (this.nearData) {
        let markers = [];
        for (let regional of this.nearData) {
          regional.distance = 0;
          regional.visible = false;
          regional.current = false;
          let nabo_img = 'http://rayi.in/naboApi/mapicon/nabo_home.png';
          console.log(regional.latitude + ',' + regional.longitude);
          let markerData = {
            position: {
              lat: regional.latitude,
              lng: regional.longitude
            },
            map: this.map,
            icon: nabo_img,
            //title: regional.username,
          };

          regional.marker = new google.maps.Marker(markerData);
          markers.push(regional.marker);
          let content = "naboUSer";
          let infoWindow = new google.maps.InfoWindow({
            content: content
          });
          //infoWindow.open(this.map, regional.marker);
          regional.marker.addListener('click', () => {
            for (let c of this.nearData) {
              c.current = false;
              //c.infoWindow.close();
            }
            this.currentregional = regional;
            regional.current = true;
            let alert_img = 'http://rayi.in/naboApi/mapicon/alert_home.png';
            let markerData = {
              position: {
                lat: regional.latitude,
                lng: regional.longitude
              },
              map: this.map,
              icon: alert_img,
              //title: regional.title,
            };
            infoWindow.open(this.map, regional.marker);
            this.map.panTo(regional.marker.getPosition());
          });
        }

      }
      this.AuthServiceProvider.postData(user_detail[0], 'rangevalue').then((result) => {
        this.responsedata = result;
        console.log(this.responsedata);
        if(true == this.responsedata.status){
          
             // this.get_user();
            }
      });

    }, (err) => {
      // Error log
    });
    // this.AuthServiceProvider.postData(this.setData[0], 'nearby_user').then((result) => {
    //   this.nearbyuser = result;
    //   console.log(this.nearbyuser);
    // })
    //  this.addMap(user_detail[0].latitude,user_detail[0].longitude);
    //return JSON.stringify(simpleObject);
  }
  outofhome(event) {
    this.submitProfile = true;
    console.log("test" + JSON.stringify(event));
    console.log(event);
    var outofhomedata = this.responseData;
    outofhomedata[0]['outofhome'] = event;
    this.AuthServiceProvider.postData(outofhomedata[0], 'outofhome').then((result) => {
      this.responsedata = result;
      if(true == this.responsedata.status){
    
      //  this.get_user();
      }
      console.log(this.out_of_home);
    })
  }
  notify() {
    this.submitProfile = true;
    console.log("test" + JSON.stringify(this.dnd));
    var notifydata=this.responseData;
    notifydata[0]["notify"] = JSON.stringify(this.dnd);
    this.AuthServiceProvider.postData(notifydata[0], 'dnd').then((result) => {
      this.responsedata = result;
      if(true == this.responsedata.status){
        
           // this.get_user();
          }
    })
  }

}
