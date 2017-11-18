import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation'; 
import { GooglePlus } from '@ionic-native/google-plus';
import { NativeStorage } from '@ionic-native/native-storage';
import { FormBuilder,Validators } from '@angular/Forms';
import { ForgotpasswordPage } from '../pages/forgotpassword/forgotpassword';
import { ResetpasswordPage } from '../pages/resetpassword/resetpassword';
import { HomePage } from '../pages/home/home';
import { MyaccountPage } from '../pages/myaccount/myaccount';
import { SigninPage } from '../pages/signin/signin';
import { SignupPage } from '../pages/signup/signup';
import { MapPage } from '../pages/map/map';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { ContactusPage } from '../pages/contactus/contactus';
import { ShopPage } from '../pages/shop/shop';
import { OfferalarmPage } from '../pages/offeralarm/offeralarm'; 
import { SecurityPage } from '../pages/security/security';
import { NotificationPage} from '../pages/notification/notification';
import { EmailComposer} from '@ionic-native/email-composer';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms'
import { Facebook } from '@ionic-native/facebook';
import { Keyboard } from '@ionic-native/keyboard';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MyaccountPage,
    SigninPage,
    SignupPage,
    ForgotpasswordPage,
    ResetpasswordPage,
    AboutPage,
    NotificationPage,
    ContactPage,
    ShopPage,
    OfferalarmPage,
    SecurityPage,
    ContactusPage,
    MapPage
  ],
  imports: [
    FormsModule,ReactiveFormsModule,
    BrowserModule,HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,AboutPage,
    MyaccountPage,
    SigninPage,
    SignupPage,
    ForgotpasswordPage,
    ResetpasswordPage,
    ContactPage,
    NotificationPage,
    ShopPage,
    OfferalarmPage,
    SecurityPage,
    ContactusPage,
    MapPage
  ],
  providers: [
    GooglePlus,
    NativeStorage,
    Keyboard ,
    FileTransfer,
    FileTransferObject,
    File,
    EmailComposer,
    Camera,
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    Facebook
  ]
})
export class AppModule {}
