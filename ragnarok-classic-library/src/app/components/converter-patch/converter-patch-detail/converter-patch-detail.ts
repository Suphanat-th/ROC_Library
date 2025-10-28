import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-converter-patch-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './converter-patch-detail.html',
  styleUrl: './converter-patch-detail.scss',
})
export class ConverterPatchDetail {
  @Input() identifiedDescriptionName!: string[];
  identifiedDescription: string = '';
  ngOnInit(): void {
    this.identifiedDescription = this.parseDetail(this.identifiedDescriptionName);
  }
  parseDetail(text: string[]): string {
    if (!text) return '';
    let textDesc: string[] = [];
    const redColor = '^ff0000';
    for (let f of text) {
      const str = f.split(redColor);
      f = str.length > 1 ? `<span class="text-[#ff0000]">${str[1]}</span>` : str[0];
      if(f===""){
        f = "___________________________________________________________________________"
      }
      if (f.includes('ประเภท')) {
        break;
      }
      textDesc.push(f+'<br>');
    }
    return textDesc.join('')
  }
}
