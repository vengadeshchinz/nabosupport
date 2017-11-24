import { Component, ViewChild,ElementRef } from '@angular/core';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation'; 
import { NavController, NavParams,Platform } from 'ionic-angular';
import {AuthServiceProvider} from '../../providers/auth-service/auth-service';
//import { GoogleMaps,GoogleMap} from '@ionic-native/google-maps';
/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})




export class MapPage {
  options : GeolocationOptions;
 currentPos : Geoposition;
  //places : Array<any> ; 
  regionals: any = [];
  currentregional: any;
@ViewChild('map') mapElement: ElementRef;
map: any;
LastLng1:any;
LastLat1:any;
marker:any;
address:any;
responseData:any;
  constructor(public navCtrl: NavController,
    public AuthServiceProvider:AuthServiceProvider, 
     public navParams: NavParams,private geolocation: Geolocation) {
    var userdata= JSON.parse(localStorage.getItem('userData'));
    console.log(userdata['user_id']);
    this.getUseraddress();
    // this.regionals = [{
    //   "title": "Marker 1",
    //   "latitude": 12.965363,
    //   "longitude": 80.201654,
    // }, {
    //   "title": "Marker 3",
    //   "latitude": 12.962378,
    //   "longitude": 80.194799,
    // }, {
    //   "title": "Marker 2",
    //   "latitude": 12.961730,
    //   "longitude": 80.187997
    // }];
   }
  getUseraddress(){
    this.AuthServiceProvider.getData('getUseraddress').then((result) => {
            this.responseData = result;
         this.regionals=this.responseData;
      
               this.regionals.forEach(function (o) {
                Object.keys(o).forEach(function (k) {
                    if (isFinite(o[k])) {
                        o[k] = +o[k];
                    }
                });
            });

            console.log(this.regionals);
      this.mapload();
       })
  }
  ionViewDidLoad() {
    
    console.log('ionViewDidLoad MapPage');
    //start
    console.log('getUser');
  
  }
  /*##Get user location map starts##*/
  mapload(){
   // this.loadMap(13.08648395538330,80.27350616455078 );
    this.options = {
         enableHighAccuracy : true
    };
 
     this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {
 
         this.currentPos = pos;      
         console.log(pos);
         console.log(pos.coords.latitude+','+pos.coords.longitude)
         //this.addMap(pos.coords.latitude,pos.coords.longitude);
       this.loadMap(pos.coords.latitude,pos.coords.longitude);
     },(err : PositionError)=>{
        console.log("error : " + err.message);
     });
  
  }
/*##map end##*/
   addInfoWindow(marker, content){
    
    let infoWindow = new google.maps.InfoWindow({
      content: content
     });
    
     google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
     });
    
   }
   /*##create gmap marker##*/
   createMarker(place)
  {
     let marker = new google.maps.Marker({
       map: this.map,
     animation: google.maps.Animation.DROP,
     draggable: true,
       position: place.geometry.location
       });   
   }   
 /*##user location mark in map##*/
    addMarker(){
      let cur_img='http://rayi.in/naboApi/mapicon/mylocation.png';
          let marker = new google.maps.Marker({
          map: this.map,
          draggable: true,
          icon:cur_img,
          animation: google.maps.Animation.DROP,
          position: this.map.getCenter()
          });
      
          let content = "<p>This is your current position !</p>";          
          let infoWindow = new google.maps.InfoWindow({
          content: content
          });
      
          google.maps.event.addListener(marker, 'click', () => {
          infoWindow.open(this.map, marker);
         });
      
      }

    //   lastLatLng(marker){
    //     let geocoder = new google.maps.Geocoder();
    //     google.maps.event.addListener(this.map, 'dragend', () =>{ 
    //       // this.LastLat1= marker.position.lat();
    //       // this.LastLng1= marker.position.lng();
    //       this.LastLat1=this.map.getCenter().lat();
    //       this.LastLng1= this.map.getCenter().lng();
    //       let latlng = new google.maps.LatLng(this.LastLat1, this.LastLng1);
    //       let request = { latLng: latlng };
    //     console.log(this.LastLat1+','+this.LastLng1);
    //     geocoder.geocode(request, (results, status) => {
    //       if (status == google.maps.GeocoderStatus.OK) {
    //         let result = results[0];
    //         let rsltAdrComponent = result.address_components;
    //         console.log(rsltAdrComponent);
    //         let resultLength = rsltAdrComponent.length;
    //         if (result != null) {
    //          // this.marker.buildingNum = rsltAdrComponent[resultLength-8].short_name;
    //        //  this.marker.streetName = rsltAdrComponent[resultLength -7].short_name;
    //        var data = new Array;
    //        var locationdata = new Array();
    //        for(var i = 0; i < rsltAdrComponent.length; i++) {
    //          var obj = rsltAdrComponent[i];
    //          data.push(obj.long_name);
             
    //        }
    //      //console.log(locdata);
    //        if(data.length == 8) {
    //          var locdata = {
    //                          hus:data[0],
    //                          street:data[1],
    //                          city:data[4]
    //                        };
    //          locationdata.push(locdata);
    //          console.log(locationdata);
    //        } else if(data.length == 9){
    //                var locdata = {
    //                              hus:data[0],
    //                              street:data[1],
    //                              city:data[3]
    //                              };
    //          locationdata.push(locdata);
    //          console.log(locationdata);
    //        } else if(data.length == 10){
    //                var locdata = {
    //                              hus:data[0],
    //                              street:data[1],
    //                              city:data[5]
    //                              };
    //          locationdata.push(locdata);
    //          console.log(locationdata);
    //        }
         
    //          console.log(locationdata);
    //         } else {
    //           alert("No address available!");
    //         }
    //       }
    //     });
    //  });
    //   }
/*##User location load##*/
loadMap(lat,long){
  console.log("lat and lang")
  let latLng= new google.maps.LatLng(lat, long);
  let mapOptions={
    center:latLng,
    zoom:15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
this.map=new google.maps.Map(this.mapElement.nativeElement,mapOptions);
this.addMarker();

let markers = [];
for (let regional of this.regionals) {
  regional.distance = 0;
  regional.visible = false;
  regional.current = false;
  let nabo_img='http://rayi.in/naboApi/mapicon/nabo_home.png';
  console.log(regional.latitude+','+regional.longitude);
  let markerData = {
    position: {
      lat: regional.latitude,
      lng: regional.longitude
    },
    map: this.map,
    icon:nabo_img,
    title: regional.username,
  };

  regional.marker = new google.maps.Marker(markerData);
  markers.push(regional.marker);
  let content = regional.username;          
  let infoWindow = new google.maps.InfoWindow({
  content: content
  });
  //infoWindow.open(this.map, regional.marker);
  regional.marker.addListener('click', () => {
    for (let c of this.regionals) {
      c.current = false;
      //c.infoWindow.close();
    }
    this.currentregional = regional;
    regional.current = true;
    let alert_img='http://rayi.in/naboApi/mapicon/alert_home.png';
    let markerData = {
      position: {
        lat: regional.latitude,
        lng: regional.longitude
      },
      map: this.map,
      icon:alert_img,
      title: regional.title,
    };
    infoWindow.open(this.map, regional.marker);
    this.map.panTo(regional.marker.getPosition());
  });
}
}
}
