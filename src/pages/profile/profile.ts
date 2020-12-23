import { Component } from '@angular/core';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageService,
    public clienteService: ClienteService) {
  }

  ionViewDidLoad() {

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
    },
      error => { });
  }
}
