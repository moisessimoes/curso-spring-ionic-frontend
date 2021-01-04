import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { API_CONFIG } from "../../config/api.config";
import { ClienteDTO } from "../../models/cliente.dto";
import { ImageUtilService } from "../image-util.service";
import { StorageService } from "../storage.Service";



@Injectable()
export class ClienteService {

    constructor(public http: HttpClient, public storage: StorageService, public imageUtilService: ImageUtilService) { }

    /*O metodo abaixo vai ser refatorado, do jeito que ele esta agora:
    
    findByEmail(email: string): Observable<ClienteDTO> {

        return this.http.get<ClienteDTO>(`${API_CONFIG.baseUrl}/clientes/email?value=${email}`);
    }

    Ele esta tipado, agora ele vai ficar como esta mostrando abaixo, sem tipagem, ou seja,
    agora será retornado todos os dados do cliente, inclusive seus endereços.
    
    */

    findByEmail(email: string) {

        return this.http.get(`${API_CONFIG.baseUrl}/clientes/email?value=${email}`);
    }


    findById(id: string) {

        return this.http.get(`${API_CONFIG.baseUrl}/clientes/${id}`);
    }

    //Esse codigo abaixo serve para fazer uma requisição GET para buscar a imagem do cliente lá no bucket da Amazon S3
    //Eu não fiz uma conta na amazon S3, mas serve de conhecimento caso precise algum dia.

    getImageFromBucket(id: string): Observable<any> {

        let url = `${API_CONFIG.bucketBaseUrl}/cp${id}.jpg`
        return this.http.get(url, { responseType: 'blob' });
    }


    insert(obj: ClienteDTO) {

        return this.http.post(`${API_CONFIG.baseUrl}/clientes`, obj, {
            observe: 'response',
            responseType: 'text'
        });
    }


    upLoadPicture(picture) {

        let pictureBlob = this.imageUtilService.dataUriToBlob(picture);
        let formData: FormData = new FormData();

        formData.set('file', pictureBlob, 'file.png');

        return this.http.post(`${API_CONFIG.baseUrl}/clientes/picture`, formData, {
            observe: 'response',
            responseType: 'text'
        });
    }
}