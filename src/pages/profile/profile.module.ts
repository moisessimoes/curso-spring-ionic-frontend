import { NgModule } from '@angular/core';
//import { CameraOriginal } from '@ionic-native/camera';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';


@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
  ]
  //providers: [
  //CameraOriginal
  //]
})
export class ProfilePageModule { }
