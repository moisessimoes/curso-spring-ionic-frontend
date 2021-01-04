import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CameraOptions, CameraOriginal } from '@ionic-native/camera';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { StorageService } from '../../services/storage.Service';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClienteDTO;
  picture: string;
  cameraOn: boolean;
  profileImage;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageService,
    public clienteService: ClienteService, public sanitizer: DomSanitizer) {

    this.profileImage = 'assets/imgs/avatar-blank.jpg'
    //public camera: CameraOriginal
  }

  ionViewDidLoad() {

    this.loadData();
  }


  loadData() {

    let localUser = this.storage.getLocalUser();

    if (localUser && localUser.email) {

      this.clienteService.findByEmail(localUser.email).subscribe(response => {

        this.cliente = response as ClienteDTO; //Fazendo cast da resposta para ClienteDTO, pois o metodo no ClienteService foi alterado
        //buscar imagem
        //this.getImageIfExists();
      },
        error => {

          if (error.status == 403) {
            this.navCtrl.setRoot('HomePage');
          }
        });
    }
    else {
      this.navCtrl.setRoot('HomePage');
    }
  }

  //Esse codigo abaixo serve para verificar se a imagem do cliente existe lá no bucket da Amazon S3
  //Eu não fiz uma conta na amazon S3, mas serve de conhecimento caso precise algum dia.

  getImageIfExists() {

    this.clienteService.getImageFromBucket(this.cliente.id).subscribe(response => {
      this.cliente.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`;
      this.blobToDataURL(response).then(dataUrl => {
        let str: string = dataUrl as string;
        this.profileImage = this.sanitizer.bypassSecurityTrustUrl(str);
      });
    },
      error => { this.profileImage = 'assets/imgs/avatar-blank.jpg' });
  }


  blobToDataURL(blob) { //https://gist.github.com/frumbert/3bf7a68ffa2ba59061bdcfc016add9ee

    return new Promise((fulfill, reject) => {
      let reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (e) => fulfill(reader.result);
      reader.readAsDataURL(blob);
    })
  }


  /*  getCameraPicture() {
 
     this.cameraOn = true;
 
     const options: CameraOptions = {
       quality: 100,
       destinationType: this.camera.DestinationType.FILE_URI,
       encodingType: this.camera.EncodingType.PNG,
       mediaType: this.camera.MediaType.PICTURE
     }
 
     this.camera.getPicture(options).then((imageData) => {
       // imageData is either a base64 encoded string or a file URI
       // If it's base64 (DATA_URL):
       this.picture = 'data:image/png;base64,' + imageData;
       this.cameraOn = false;
     }, (err) => {
       this.cameraOn = false;
     });
   }*/


  /*getGalleryPicture() {

    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.picture = 'data:image/png;base64,' + imageData;
      this.cameraOn = false;
    }, (err) => {
      this.cameraOn = false;
    });
  } */


  sendPicture() {

    this.clienteService.upLoadPicture(this.picture).subscribe(response => {
      this.picture = null;
      this.getImageIfExists();
    },
      error => { });
  }


  cancel() {
    this.picture = null;
  }
}
