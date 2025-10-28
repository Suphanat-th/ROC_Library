import { Component } from '@angular/core';
import { RouterLinkWithHref, RouterModule } from "@angular/router";

@Component({
  selector: 'app-navbar',
  imports: [RouterLinkWithHref,RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

}
