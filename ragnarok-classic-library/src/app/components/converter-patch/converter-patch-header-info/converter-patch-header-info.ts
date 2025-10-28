import { KeyValue, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PatchItemsDto } from '../../../models/converter-patch/PatchItem-interface';

@Component({
  selector: 'app-converter-patch-header-info',
  standalone: true,
  imports: [NgIf],
  templateUrl: './converter-patch-header-info.html',
  styleUrls: ['./converter-patch-header-info.scss'],
})
export class ConverterPatchHeaderInfo {
  @Input() identifiedDisplayName!: string;
  @Input() slotCount!: number;
  @Input() isCostume: boolean = false;

}
