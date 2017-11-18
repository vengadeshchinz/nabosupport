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
         var user_detail=this.responseData;
           
         this.regionals =[{"user_id":"1","username":"admin","street_address":"93","zipcode":"600003","city":"Choolai","country":"Vijayvinagar Koil Street","latitude":"80.27350616455078","longitude":"13.08648395538330"},{"user_id":"2","username":"usertest67","street_address":"VP Hall Compound Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"80.27350616455078","longitude":"13.08648395538330"},{"user_id":"3","username":"usertest341","street_address":"VP Hall Compound Road","zipcode":"600034","city":"Chennai","country":"India","latitude":"80.27350616455078","longitude":"13.08648395538330"},{"user_id":"32","username":"Packram","street_address":"VP Hall Compound Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"80.27350616455078","longitude":"13.08648395538330"},{"user_id":"34","username":"dfggg","street_address":"VP Hall Compound Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"80.27350616455078","longitude":"13.08648395538330"},{"user_id":"35","username":"mohan","street_address":"VP Hall Compound Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"80.27350616455078","longitude":"13.08648395538330"},{"user_id":"36","username":"test","street_address":"VP Hall Compound Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"80.27350616455078","longitude":"13.08648395538330"},{"user_id":"37","username":"test","street_address":"VP Hall Compound Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"80.27350616455078","longitude":"13.08648395538330"},{"user_id":"38","username":"Suchita","street_address":"VP Hall Compound Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"80.27350616455078","longitude":"13.08648395538330"},{"user_id":"39","username":"Rajesh","street_address":"VP Hall Compound Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"80.27350616455078","longitude":"13.08648395538330"},{"user_id":"40","username":"Test","street_address":"VP Hall Compound Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"80.27350616455078","longitude":"13.08648395538330"},{"user_id":"41","username":"Test","street_address":"VP Hall Compound Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"80.27350616455078","longitude":"13.08648395538330"},{"user_id":"42","username":"Test1","street_address":"VP Hall Compound Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"80.27350616455078","longitude":"13.08648395538330"},{"user_id":"43","username":"Test2","street_address":"VP Hall Compound Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"80.27350616455078","longitude":"13.08648395538330"},{"user_id":"44","username":"Test3","street_address":"VP Hall Compound Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"80.27350616455078","longitude":"13.08648395538330"},{"user_id":"45","username":"Test4","street_address":"VP Hall Compound Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"80.27350616455078","longitude":"13.08648395538330"},{"user_id":"46","username":"nabo","street_address":"VP Hall Compound Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"80.27350616455078","longitude":"13.08648395538330"},{"user_id":"47","username":"Test5","street_address":"VP Hall Compound Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"80.27350616455078","longitude":"13.08648395538330"},{"user_id":"48","username":"Packram","street_address":"VP Hall Compound Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"80.27350616455078","longitude":"13.08648395538330"},{"user_id":"49","username":"Packram","street_address":"VP Hall Compound Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"80.27350616455078","longitude":"13.08648395538330"},{"user_id":"50","username":"Packram","street_address":"Birkh\u00f8jvej 7","zipcode":"2800","city":"Kgs lyngbh","country":"Denmark","latitude":"80.27350616455078","longitude":"13.08648395538330"},{"user_id":"113","username":"dfgdfg","street_address":"Sydenhams Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"13.08267974853516","longitude":"80.27072143554688"},{"user_id":"114","username":"profile1","street_address":"Sydenhams Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"13.08267974853516","longitude":"80.27072143554688"},{"user_id":"118","username":"Sangeetha","street_address":"Vijayalakshmi Nagar","zipcode":"600117","city":"Chennai","country":"India","latitude":"12.93947124481201","longitude":"80.17411804199219"},{"user_id":"120","username":"test2345","street_address":"Sydenhams Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"13.08267974853516","longitude":"80.27072143554688"},{"user_id":"124","username":"test6","street_address":"Sydenhams Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"13.08267974853516","longitude":"80.27072143554688"},{"user_id":"126","username":"test8","street_address":"Sydenhams Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"13.08267974853516","longitude":"80.27072143554688"},{"user_id":"129","username":"dfgsdfg","street_address":"Sydenhams Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"13.08267974853516","longitude":"80.27072143554688"},{"user_id":"130","username":"cxvcxv","street_address":"Sydenhams Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"13.08267974853516","longitude":"80.27072143554688"},{"user_id":"145","username":"vbccb","street_address":"Sydenhams Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"13.08267974853516","longitude":"80.27072143554688"},{"user_id":"147","username":"fgfg","street_address":"Sydenhams Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"13.08267974853516","longitude":"80.27072143554688"},{"user_id":"148","username":"zxcczcx","street_address":"Sydenhams Road","zipcode":"600003","city":"Chennai","country":"India","latitude":"13.08267974853516","longitude":"80.27072143554688"},{"user_id":"156","username":"tytyy","street_address":"Senthuran Colony","zipcode":"India","city":"Madipakkam","country":"Tamil Nadu","latitude":"12.96641635894775","longitude":"80.18958282470703"},{"user_id":"157","username":"tytyy","street_address":"Senthuran Colony","zipcode":"India","city":"Madipakkam","country":"Tamil Nadu","latitude":"12.96641635894775","longitude":"80.18958282470703"},{"user_id":"158","username":"Shange","street_address":"Sadagopan enclave ","zipcode":"600117","city":"Chennai","country":"India","latitude":"12.93947124481201","longitude":"80.17411804199219"},{"user_id":"159","username":"Packram2","street_address":"Birkh\u00f8jvej","zipcode":"2800","city":"Lyngby-Taarb\u00e6k Municipality","country":"Denmark","latitude":"55.76180267333984","longitude":"12.48300457000732"},{"user_id":"160","username":"test","street_address":"Senthuran Colony","zipcode":"India","city":"Madipakkam","country":"Tamil Nadu","latitude":"12.96644115447998","longitude":"80.18954467773438"},{"user_id":"161","username":"user777","street_address":"Senthuran Colony","zipcode":"India","city":"Madipakkam","country":"Tamil Nadu","latitude":"12.96645259857178","longitude":"80.18952941894531"},{"user_id":"162","username":"admin1","street_address":"Annamalai Street","zipcode":"India","city":"Madipakkam","country":"Tamil Nadu","latitude":"12.97103691101074","longitude":"80.19307708740234"},{"user_id":"166","username":"user546546","street_address":"Senthuran Colony","zipcode":"India","city":"Madipakkam","country":"Tamil Nadu","latitude":"12.96641826629639","longitude":"80.18977355957031"},{"user_id":"167","username":"user6666","street_address":"Senthuran Colony","zipcode":"India","city":"Madipakkam","country":"Tamil Nadu","latitude":"12.96638584136963","longitude":"80.18961334228516"},{"user_id":"175","username":"","street_address":"Senthuran Colony","zipcode":"India","city":"Madipakkam","country":"Tamil Nadu","latitude":"12.96641731262207","longitude":"80.18958282470703"},{"user_id":"176","username":"","street_address":"Senthuran Colony","zipcode":"India","city":"Madipakkam","country":"Tamil Nadu","latitude":"12.96641635894775","longitude":"80.18958282470703"}];
           })
  }
  ionViewDidLoad() {
    
    console.log('ionViewDidLoad MapPage');
    //start
    console.log('getUser');
    this.mapload();
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
           //  this.marker.streetName = rsltAdrComponent[resultLength -7].short_name;
           var data = new Array;
           var locationdata = new Array();
           for(var i = 0; i < rsltAdrComponent.length; i++) {
             var obj = rsltAdrComponent[i];
             data.push(obj.long_name);
             
           }
         //console.log(locdata);
           if(data.length == 8) {
             var locdata = {
                             hus:data[0],
                             street:data[1],
                             city:data[4]
                           };
             locationdata.push(locdata);
             console.log(locationdata);
           } else if(data.length == 9){
                   var locdata = {
                                 hus:data[0],
                                 street:data[1],
                                 city:data[3]
                                 };
             locationdata.push(locdata);
             console.log(locationdata);
           } else if(data.length == 10){
                   var locdata = {
                                 hus:data[0],
                                 street:data[1],
                                 city:data[5]
                                 };
             locationdata.push(locdata);
             console.log(locationdata);
           }
         
             console.log(locationdata);
            } else {
              alert("No address available!");
            }
          }
        });
     });
      }
/*##User location load##*/
loadMap(lat,long){
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
