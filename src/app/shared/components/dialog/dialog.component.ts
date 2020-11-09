import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  goToGitHub() {
    window.open(
      '//github.com//login//oauth//authorize?client_id=0d7091be8daa6877f269&scope=repo%20user%20delete_repo',
      '_self'
    );
  }
}
