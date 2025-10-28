import { Routes } from '@angular/router';
import { ConverterPatch } from './components/converter-patch/converter-patch';
import { Home } from './components/home/home';

export const routes: Routes = [
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  { path: 'Home', component: Home },
  { path: 'Converter-Patch', component: ConverterPatch },
];
