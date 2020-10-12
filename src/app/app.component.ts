import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { catchError, filter, map, takeUntil, takeWhile } from 'rxjs/operators';
import { GithubService } from './shared/services/github.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './shared/components/dialog/dialog.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  authed = false;
  selectedId: number;
  public get apiUrl() {
    return 'https://api.github.com';
  }
  public get authUrl() {
    return `https://github.com/login/oauth/authorize?client_id=${this.gh.ClientId}`;
  }

  private ngUnsubscribe = new Subject<never>();

  constructor(
    public gh: GithubService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
  ) {}

  async ngOnInit() {
    this.getAuthTokenFromCode().then((x) => {
      this.gh.Token = x;
    }).finally(() => {
      if (!this.gh.TokenExists) {
        this.openDialog();
      }
    });
    this.getRepos();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getAuthTokenFromCode(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let result: any;
      this.searchForParam('code').then((x) => {
        if (x) {
          this.enter(x).then((res) => {
            result = JSON.parse(res);
            if (result && res) resolve(result.access_token);
            else reject();
          })
        } else {
          reject();
        };
      });
    })

  }

  searchForParam(paramName: string) {
    return this.activatedRoute.queryParamMap
      .pipe(map((v, i) => v.get(paramName))).pipe(takeUntil(timer(1000))).toPromise();
  }

  openDialog(): void {
    this.dialog.open(DialogComponent);
  }
  enter(code: string) {
    return this.gh
      .post(`https://github.com/login/oauth/access_token`, {
        client_id: this.gh.ClientId,
        client_secret: this.gh.ClientSecret,
        code: code,
      });
  }

  getUsers() {
    const test = this.gh.get(`${this.apiUrl}/user`);
    console.log(test);
    return test;
  }

  getRepos() {
    console.log(this.gh.get(`${this.apiUrl}/user/repos`));
  }
}
