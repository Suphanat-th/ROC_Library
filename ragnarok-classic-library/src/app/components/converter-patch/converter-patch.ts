import { Component, OnInit } from '@angular/core';
import { ItemDbService } from '../../services/itemDbService/itemDbService';
import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';
import { ConverterPatchImage } from './converter-patch-image/converter-patch-image';
import { ConverterPatchHeaderInfo } from './converter-patch-header-info/converter-patch-header-info';
import { ConverterPatchOption } from './converter-patch-option/converter-patch-option';
import { ConverterPatchDetail } from './converter-patch-detail/converter-patch-detail';
import * as htmlToImage from 'html-to-image';
@Component({
  selector: 'app-converter-patch',
  standalone: true,
  imports: [
    CommonModule,
    ConverterPatchImage,
    ConverterPatchHeaderInfo,
    ConverterPatchOption,
    ConverterPatchDetail,
  ],
  templateUrl: './converter-patch.html',
  styleUrl: './converter-patch.scss',
})
export class ConverterPatch implements OnInit {
  bgColorTheme = '#f97814';
  items$ = this.itemService.items$;
  /**
   *
   */

  constructor(private itemService: ItemDbService) {}

  ngOnInit() {
    this.itemService.loadItems();
  }

  parseColor(text: string): string {
    if (!text) return '';

    const redColor = '^ff0000';
    const options = 'ประเภท';
    const isOption = text.split(options).length > 1;
    text = isOption ? `<hr>${text}` : text;
    const str = text.split(redColor);
    text = str.length > 1 ? `<span class="text-[#ff0000]">${str[1]}</span>` : str[0];
    return text;
  }

captureCard(elementId: string) {
  const element = document.getElementById('item' + elementId);
  if (!element) return;

  // ให้แน่ใจว่า render เสร็จก่อน (ป้องกัน gradient หาย)
  setTimeout(() => {
    htmlToImage
      .toPng(element, {
        backgroundColor: 'transparent', // หรือกำหนดสีพื้นหลังถ้าอยาก
        pixelRatio: 1,                   // ความละเอียดสูงขึ้น (ภาพคมกว่า)
        quality: 1,                      // ค่าระหว่าง 0 - 1
        cacheBust: true,                 // ป้องกัน cache เก่าจาก style เดิม
      })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `Item${elementId}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('capture error:', err);
      });
  }, 300); // หน่วงให้ CSS โหลดครบก่อน
}
}
