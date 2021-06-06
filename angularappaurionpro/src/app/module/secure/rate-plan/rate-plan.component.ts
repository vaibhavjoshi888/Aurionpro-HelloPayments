import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
  FormArray
} from '@angular/forms';
import { ValidationSetting } from '../../../constant/validation.constant';
import { ResellerService } from '../../../api/reseller.service';
import { ToasterService } from '../../../api/toaster.service';
import { StorageService } from '../../../common/session/storage.service';
import { CommonService } from '../../../api/common.service';
import { Validator } from '../../../common/validation/validator';
import { StorageType } from '../../../common/session/storage.enum';
import { FeeFrequencyEnum } from '../../../enum/fee-frequency.enum';
import { FeeTypeEnum } from '../../../enum/Fee-type.enum';
import { ChannelTypeEnum } from '../../../enum/channeltypes.enum';

@Component({
  selector: 'app-rate-plan',
  templateUrl: './rate-plan.component.html',
  styleUrls: ['./rate-plan.component.css']
})
export class RatePlanComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }
}
