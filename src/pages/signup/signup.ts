import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  formGroup: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {

    this.formGroup = this.formBuilder.group({
      //Os campos vão preenchidos apenas pra aagilizar os testes, mas numa aplicação real, esses campos devem estar vazios.
      nome: ['Pedro', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
      email: ['pedro@gmail.com', [Validators.required, Validators.email]],
      tipo: ['1', [Validators.required]],
      cpfOuCnpj: ['73198803004', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
      senha: ['321', [Validators.required]],
      logradouro: ['Rua LAU', [Validators.required]],
      numero: ['2020', [Validators.required]],
      complemento: ['Apto ASMR', []],
      bairro: ['Servidor LATÂO', []],
      cep: ['10828333', [Validators.required]],
      telefone1: ['977261827', [Validators.required]],
      telefone2: ['', []],
      telefone3: ['', []],
      estadoId: [null, [Validators.required]],
      cidadeId: [null, [Validators.required]]
    });
  }

  signupUser() {

    console.log('Enviou o form com sucesso.');
  }
}
