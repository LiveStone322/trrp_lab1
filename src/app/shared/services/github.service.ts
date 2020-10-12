import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  nodeUrl = 'http://localhost:3001';

  private token: string;

  public get ClientId() {
    return '0d7091be8daa6877f269';
  }
  public get ClientSecret() {
    return '15fb604164568d0124ccbad94955d2c10388001d';
  }
  public set Token(value: string) {
    this.token = value;
  }
  public get TokenExists(): boolean {
    return !!this.token;
  }

  constructor(private http: HttpClient) {}

  get(url: string) {
    return this.http
      .get<any>(`${this.nodeUrl}`, {
        params: {
          url,
          auth: this.token,
        },
      }).toPromise()
  }

  post(url: string, data: any) {
    return this.http
      .post<any>(`${this.nodeUrl}`, { url, data, auth: this.token }).toPromise();
  }
}
