import { Component } from '@angular/core';
import { SuiModal, ComponentModalConfig, ModalSize, SuiModalService } from 'ng2-semantic-ui';

interface IConfirmModalContext {
  question: string;
  title?: string;
}

@Component({
  selector: 'app-modal-confirm',
  template: `
    <div class="header" *ngIf="modal.context.title">{{ modal.context.title }}</div>
    <div class="content">
      <p>{{ modal.context.question }}</p>
    </div>
    <div class="actions">
      <button class="ui grey basic button" (click)="modal.deny(undefined)">Cancel</button>
      <button class="ui primary button" (click)="modal.approve(undefined)" autofocus>OK</button>
    </div>
  `
})
export class ConfirmModalComponent {
  constructor(public modal: SuiModal<IConfirmModalContext, void, void>) {}
}

export class ConfirmModal extends ComponentModalConfig<IConfirmModalContext, void, void> {
  constructor(question: string, title?: string) {
    super(ConfirmModalComponent, { question, title });

    this.isClosable = false;
    this.transitionDuration = 200;
    this.size = ModalSize.Small;
  }
}
