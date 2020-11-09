import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  nodeUrl = 'http://localhost:3000';

  public token: string;

  public get ClientId() {
    return '0d7091be8daa6877f269';
  }
  
  public set Token(value: string) {
    this.token = value;
  }

  public get TokenExists(): boolean {
    return !!this.token;
  }

  constructor(private http: HttpClient) {}

  get(url: string, auth: boolean, params: object = {}) {
    let qParams = new HttpParams();
    qParams = qParams.append('url', url);
    if (auth) { 
      qParams = qParams.append('auth', this.token);
    }
    Object.keys(params).forEach(p => {
      qParams = qParams.append(p, params[p]);
    });

    return this.http
    .get<any>(this.nodeUrl, {
      params: qParams
    }).toPromise()
  }

  remove(url: string, auth: boolean, params: object = {}) {
    let qParams = new HttpParams();
    qParams = qParams.append('url', url);
    if (auth) { 
      qParams = qParams.append('auth', this.token);
    }
    Object.keys(params).forEach(p => {
      qParams = qParams.append(p, params[p]);
    });

    return this.http
    .delete<any>(this.nodeUrl, {
      params: qParams
    }).toPromise()
  }

  post(url: string, data: any, auth: boolean) {
    return this.http
      .post<any>(this.nodeUrl, { url, data, auth: this.token }).toPromise();
  }

  patch(url: string, data: any, auth: boolean) {
    console.log(url)
    return this.http
      .patch<any>(this.nodeUrl, { url, data, auth: this.token }).toPromise();
  }
}
