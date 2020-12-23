import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { CartItem } from '../../models/cart-item';
import { CartService } from '../../services/domain/cart.service';
import { ProdutoService } from '../../services/domain/produto.service';

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  items: CartItem[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public cartService: CartService,
    public produtoService: ProdutoService) {
  }

  ionViewDidLoad() {

    let cart = this.cartService.getCart();

    this.items = cart.items;

    //this.loadImgsUrls();
  }


  //O metodo abaixo serve para carregar as imagens do produtos no bucket da Amazon S3. Não tenho conta lá, mas serve de
  //conhecimento.

  loadImgsUrls() {

    for (var i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      this.produtoService.getSmallImageFromBucket(item.produto.id).subscribe(response => {
        item.produto.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.produto.id}-small.jpg`
      },
        error => { });
    }
  }
}