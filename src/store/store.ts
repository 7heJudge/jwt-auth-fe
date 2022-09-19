import {makeAutoObservable} from "mobx";
import {API_URL} from "../http";
import {IError} from "../models/IError";
import {IUser} from "../models/IUser";
import {AuthResponse} from "../models/response/AuthResponse";
import AuthService from "../services/AuthService";
import axios from 'axios';

export default class Store {
    user = {} as IUser;
    isLoading = false;
    isAuth = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(auth: boolean) {
        this.isAuth = auth;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setLoading(loading: boolean) {
        this.isLoading = loading;
    }

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e: unknown) {
            const typedError = e as IError;
            console.log(typedError.response.data.message);
        }
    }

    async registration(email: string, password: string) {
        try {
            const response = await AuthService.registration(email, password);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e: unknown) {
            const typedError = e as IError;
            console.log(typedError.response.data.message);
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (e: unknown) {
            const typedError = e as IError;
            console.log(typedError.response.data.message);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true });
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e: unknown) {
            const typedError = e as IError;
            console.log(typedError.response.data.message);
        } finally {
            this.setLoading(false);
        }
    }
}
