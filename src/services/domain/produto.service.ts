import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { API_CONFIG } from "../../config/api.config";


@Injectable()
export class ProdutoService {

    constructor(public http: HttpClient) { }

    findByCategoria(categoria_id: string) {

        return this.http.get(`${API_CONFIG.baseUrl}/produtos/?categorias=${categoria_id}`);
    }

    //O metodo abaixo serve para buscar as imagens do produtos no bucket da Amazon S3. Não tenho conta lá, mas serve de
    //conhecimento.

    getSmallImageFromBucket(id: string): Observable<any> {

        let url = `${API_CONFIG.bucketBaseUrl}/prod${id}-small.jpg`
        return this.http.get(url, { responseType: 'blob' });
    }
}