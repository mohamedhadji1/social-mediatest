import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  opened: boolean = false;
  events: string[] = [];

  toggleSidebar() {
    this.opened = !this.opened;
    this.events.push(`Sidebar toggled (opened: ${this.opened})`);
  }
  
}
