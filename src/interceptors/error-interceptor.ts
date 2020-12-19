import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { StorageService } from "../services/storage.Service";
import { AlertController } from "ionic-angular";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(public storage: StorageService, public alertControler: AlertController) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req).catch((error, caught) => {

            let errorObj = error;

            if (errorObj.error) {
                errorObj = errorObj.error;
            }

            if (!errorObj.status) {
                errorObj = JSON.parse(errorObj);
            }

            console.log("Erro detectado pelo interceptor:");
            console.log(errorObj);

            switch (errorObj.status) {

                case 403:
                    this.handle403Autenticacao();
                    break;

                case 403: //Tratando o erro 403
                    this.handle403();
                    break;

                default:
                    this.handleDefaultErrors(errorObj);
                    break;


            }

            return Observable.throw(errorObj);
        }) as any;
    }

    handle403() {

        this.storage.setLocalUser(null);
    }

    handle403Autenticacao() {

        let alert = this.alertControler.create({
            title: 'Erro 401: Falha de autenticação',
            message: 'Email ou senha incorretos.',
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }

    handleDefaultErrors(errorObj) {

        let alert = this.alertControler.create({
            title: 'Erro ' + errorObj.status + ': ' + errorObj.error,
            message: errorObj.message,
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }
}

export const ErrorInterceptorProvider = {

    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};