import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-converter-patch-image',
  standalone: true,
  imports: [],
  templateUrl: './converter-patch-image.html',
  styleUrls: ['./converter-patch-image.scss'],
})
export class ConverterPatchImage {
  @Input() key: string = '';
}
