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

  items: ProdutoDTO[] = [];
  page: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public produtoService: ProdutoService,
    public loadingControl: LoadingController) {
  }

  ionViewDidLoad() {

    this.loadData();
  }


  loadData() {

    let categoria_id = this.navParams.get('categoriaId');
    let loader = this.presentLoading();
    this.produtoService.findByCategoria(categoria_id, this.page, 10).subscribe(response => {

      //let start = this.items.length; //para controlar o carregamento das imagens dos produtos, para n repetir.
      this.items = this.items.concat(response['content']);
      //let end = this.items.length - 1; ////para controlar o carregamento das imagens dos produtos, para n repetir.
      loader.dismiss();
      console.log(this.page);
      console.log(this.items);
      //this.loadImgsUrls(start, end);
    },
      error => { loader.dismiss(); });
  }


  //O metodo abaixo serve para carregar as imagens do produtos no bucket da Amazon S3. Não tenho conta lá, mas serve de
  //conhecimento.

  loadImgsUrls(start: number, end: number) {

    for (var i = start; i <= end; i++) {
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


  doRefresh(refresher) {
    this.page = 0;
    this.items = [];
    this.loadData();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }


  doInfinite(infiniteScroll) {

    this.page++;
    this.loadData();
    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);
  }
}
