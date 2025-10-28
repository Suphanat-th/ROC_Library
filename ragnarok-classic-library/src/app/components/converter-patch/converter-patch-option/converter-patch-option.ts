import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-converter-patch-option',
  imports: [],
  templateUrl: './converter-patch-option.html',
  styleUrl: './converter-patch-option.scss',
})
export class ConverterPatchOption {
  @Input() identifiedDescriptionName!: string[];
  identifiedDescription: string = '';

  ngOnInit(): void {
    console.log(this.identifiedDescriptionName);
    this.identifiedDescription = this.parseOption(this.identifiedDescriptionName);
  }
  parseOption(text: string[]): string {
    if (!text) return '';
    let textDesc: string[] = [];
    let isOption = false;
    for (let f of text) {
      if (f.includes('ประเภท')) {
        isOption = true;
      }
      if (!isOption) continue;

      if (f.includes('ประเภท')) {
        let splitType: string[] = [];
        if (f.includes('พลังป้องกัน')) {
          splitType = f.split('พลังป้องกัน');
        } else {
          splitType = f.split('พลังโจมตี');
        }
        console.log(splitType);
        const equimentType = splitType[0].split(':');
        const equimentProtect = splitType[1].split(':');
        textDesc.push(
          `<span>${equimentType[0]}</span>:<span  class='text-orange-600 font-extrabold'>${equimentType[1]}</span><br>`,
        );
        textDesc.push(
          `<span>พลังป้องกัน</span> : <span class='text-orange-600  font-extrabold'>${equimentProtect[1]}</span><br>`,
        );
      } else if (f.includes('ตำแหน่ง')) {
        const splitType = f.split('น้ำหนัก');
        const equimentPosition = splitType[0].split(':');
        const equimentWeight = splitType[1].split(':');
        textDesc.push(
          `<span>${equimentPosition[0]}</span>:<span  class='text-orange-600 font-extrabold'>${equimentPosition[1]}</span><br>`,
        );
        textDesc.push(
          `<span>น้ำหนัก</span> : <span class='text-orange-600 font-extrabold'>${equimentWeight[1]}</span><br>`,
        );
      } else {
        const equimentOther = f.split(':');
        textDesc.push(
          `<span>${equimentOther[0]}</span> : <span class='text-orange-600  font-extrabold'>${equimentOther[1]}</span><br>`,
        );
      }
    }
    return textDesc.join('');
  }
  splitTitle(string: string): string {
    return '';
  }
}
