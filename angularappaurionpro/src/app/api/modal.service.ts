import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {ComponentModalConfig, ModalSize} from "ng2-semantic-ui";
import {ConfirmModalComponent} from "../module/common/modal/modal.component";
// import {IConfirmModalContext} from "../module/common/modal/modal.component";



// export class ConfirmModal extends ComponentModalConfig<IConfirmModalContext, void, void> {
//   constructor(title:string, question:string, size = ModalSize.Small) {
//     super(ConfirmModalComponent, { title, question });
//
//     this.isClosable = false;
//     this.transitionDuration = 200;
//     this.size = size;
//   }
// }
