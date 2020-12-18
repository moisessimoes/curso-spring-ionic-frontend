import { Injectable } from "@angular/core";
import { STORAGE_KEYS } from "../config/storage_keys.config";
import { LocalUser } from "../models/localUser";

@Injectable()
export class StorageService {

    getLocalUser(): LocalUser {

        let user = localStorage.getItem(STORAGE_KEYS.localUser); //Pegando o usuario logado

        if (user == null) {
            return null;

        } else {
            return JSON.parse(user);
        }
    }

    setLocalUser(obj: LocalUser) {

        if (obj == null) {

            localStorage.removeItem(STORAGE_KEYS.localUser);

        } else {

            localStorage.setItem(STORAGE_KEYS.localUser, JSON.stringify(obj));
        }
    }
}