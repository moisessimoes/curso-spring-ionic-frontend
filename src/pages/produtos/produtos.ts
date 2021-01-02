import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items: ProdutoDTO[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public produtoService: ProdutoService,
    public loadingControl: LoadingController) {
  }

  ionViewDidLoad() {

    let categoria_id = this.navParams.get('categoriaId');
    let loader = this.presentLoading();
    this.produtoService.findByCategoria(categoria_id).subscribe(response => {

      this.items = response['content'];
      loader.dismiss();
      //this.loadImgsUrls();
    },
      error => { loader.dismiss(); });

  }


  //O metodo abaixo serve para carregar as imagens do produtos no bucket da Amazon S3. Não tenho conta lá, mas serve de
  //conhecimento.

  loadImgsUrls() {

    for (var i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      this.produtoService.getSmallImageFromBucket(item.id).subscribe(response => {
        item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
      },
        error => { });
    }
  }


  showDetail(produto_id: string) {

    this.navCtrl.push('ProdutoDetailPage', { produtoId: produto_id });
  }


  presentLoading() {

    let loader = this.loadingControl.create({
      content: "Aguarde..."
    });
    loader.present();

    return loader;
  }
}
