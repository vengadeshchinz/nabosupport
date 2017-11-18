import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import 'rxjs/add/operator/map';
let apiUrl="http://rayi.in/naboApi/";
/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {

  constructor(public http: Http) {
    console.log('Hello AuthServiceProvider Provider');
  }
  postData(credentials, type) {

    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      //let options = new RequestOptions({headers:headers});
      this.http.post(apiUrl + type, JSON.stringify(credentials), {headers: headers})
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });

  }
  getData(type) {
    
        return new Promise((resolve, reject) => {
                  //let options = new RequestOptions({headers:headers});
          this.http.get(apiUrl + type)
            .subscribe(res => {
              resolve(res.json());
            }, (err) => {
              reject(err);
            });
        });
    
      }

}
