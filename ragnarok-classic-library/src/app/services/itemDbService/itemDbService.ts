import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { PatchItemsDto } from '../../models/converter-patch/PatchItem-interface';

@Injectable({
  providedIn: 'root'
})
export class ItemDbService {

  private itemsSubject = new BehaviorSubject<Record<string, PatchItemsDto>>({});
  items$ = this.itemsSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadItems() {
    this.http.get<Record<string, PatchItemsDto>>('assets/json/PatchItemDB.json').subscribe({
      next: (res) => this.itemsSubject.next(res),
      error: (err) => console.error('เกิดข้อผิดพลาด:', err)
    });
  }
}