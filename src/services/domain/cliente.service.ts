import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { API_CONFIG } from "../../config/api.config";
import { ClienteDTO } from "../../models/cliente.dto";
import { StorageService } from "../storage.Service";



@Injectable()
export class ClienteService {

    constructor(public http: HttpClient, public storage: StorageService) { }


    findByEmail(email: string): Observable<ClienteDTO> {

        let token = this.storage.getLocalUser().token;
        let authHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + token });

        return this.http.get<ClienteDTO>(`${API_CONFIG.baseUrl}/clientes/email?value=${email}`,
            { 'headers': authHeader });
    }

    //Esse codigo abaixo serve para fazer uma requisição GET para buscar a imagem do cliente lá no bucket da Amazon S3
    //Eu não fiz uma conta na amazon S3, mas serve de conhecimento caso precise algum dia.

    getImageFromBucket(id: string): Observable<any> {

        let url = `${API_CONFIG.bucketBaseUrl}/cp${id}.jpg`
        return this.http.get(url, { responseType: 'blob' });
    }
}