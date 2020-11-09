import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ContentChild, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormControlName } from '@angular/forms';
import { Repo } from '../../shared/models/github.models'

@Component({
  selector: 'app-repo',
  templateUrl: './repo.component.html',
  styleUrls: ['./repo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepoComponent implements OnInit {
  @Input() repoName = '';
  @Input() repoDescription = '';
  @Input() repoPrivate = false;

  @Output() onSave = new EventEmitter<Repo>();
  @Output() onCancel = new EventEmitter();
  @Output() onDelete = new EventEmitter();

  @ViewChild('matCard', { read: ElementRef }) matCard: ElementRef;

  editting = false;
  nameControl = new FormControl();
  descControl = new FormControl();
  visibility;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.nameControl.setValue(this.repoName);
    this.descControl.setValue(this.repoDescription);
    this.visibility = this.repoPrivate ? 'private' : 'public';
  }

  onEditClick() {
    if (!this.editting) {
      this.expand();
      setTimeout(() => {
        if (!this.editting) {
          this.editting = !this.editting;
          this.cd.detectChanges();
        }
      }, 250)
    }
    else {
      this.collapse();
      this.editting = !this.editting;
    }
  }

  onDeleteClick() {
    this.editting = false;
    this.onDelete.emit()
  }

  onSaveClick() {
    this.collapse();
    this.editting = false;
    this.onSave.emit({
      name: this.nameControl.value,
      description: this.descControl.value,
      private: this.visibility === 'public' ? false : true
    })
  }

  onCancelClick() {
    this.collapse();
    this.editting = false;
  }

  expand() {
    this.matCard.nativeElement.style.background = '#FAFAFA';
    this.matCard.nativeElement.style.minHeight = '163px';
  }

  collapse() {
    this.matCard.nativeElement.style.background = '#FFFFFF';
    this.matCard.nativeElement.style.minHeight = '72px';
  }
}
