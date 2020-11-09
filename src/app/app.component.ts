import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, timer } from 'rxjs';
import { catchError, filter, map, takeUntil, takeWhile } from 'rxjs/operators';
import { GithubService } from './shared/services/github.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './shared/components/dialog/dialog.component'
import { Repo } from './shared/models/github.models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  authed = false;
  selectedId: number;
  avatarSrc$ = new Subject<string>();
  name$ = new Subject<string>();
  repos$ = new Subject<Repo>();

  user: any;
  repos: any;

  public get apiUrl() {
    return 'https://api.github.com';
  }
  public get authUrl() {
    return `https://github.com/login/oauth/authorize?client_id=${this.gh.ClientId}&scope=repo%20user%20delete_repo`;
  }

  private ngUnsubscribe = new Subject<never>();

  constructor(
    public gh: GithubService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
  ) {}

  async ngOnInit() {
    const code = await this.paramExists('code');
    if (code) {
      const t = JSON.parse(await this.enter(code));
      if (t.access_token) {
        this.authed = true;
        this.gh.Token = t.access_token;
      }
    } 
    if (!this.authed) {
      this.openDialog();
    }
    else {
      this.loadInfo();
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  openDialog() {
    setTimeout(() => this.dialog.open(DialogComponent), 1000)
  }

  async loadInfo() {
    this.repos = await this.getRepos();
    this.user = await this.getUser();
    this.name$.next(this.user.login);
    this.avatarSrc$.next(this.user.avatar_url);
    this.repos$.next(this.repos.map(x => { return {
      name: x.name,
      description: x.description,
      private: x.private
    }}));
  }

  paramExists(paramName: string) {
    return this.activatedRoute.queryParams.pipe(map((p) => p[paramName]), takeUntil(timer(1000))).toPromise();
  }

  enter(code: string) {
    return this.gh
      .post(`https://github.com/login/oauth/access_token`, {
        client_id: this.gh.ClientId,
        client_secret: '',
        code: code,
      }, false);
  }

  getRepos() {
    return this.gh.get(`${this.apiUrl}/user/repos`, true, {
      sort: 'updated', 
      direction: 'asc'
    });
  }

  getUser() {
    return this.gh.get(`${this.apiUrl}/user`, true);
  }

  async onSave(event: Repo) {
    const res = await this.gh.patch(`${this.apiUrl}/repos/${this.user.login}/${event.name}`, {
      name: event.name,
      description: event.description,
      peivate: event.private
    }, true);
    console.log(res);
  }

  async onDelete(repoName: string) {
    console.log(`${this.apiUrl}/repos/${this.user.login}/${repoName}`);
    const res = await this.gh.remove(`${this.apiUrl}/repos/${this.user.login}/${repoName}`, true);
    console.log(res);
  }
}
