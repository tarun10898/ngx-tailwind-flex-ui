import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'lib-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', animate('300ms ease-in')),
      transition('* => void', animate('300ms ease-out')),
    ]),
  ],
})
export class AlertComponent implements OnInit {
  @Input() message = '';
  @Input() type: 'success' | 'warning' | 'error' | 'info' = 'info';
  @Input() duration = 5000; // Renamed from autoDismiss to duration to match Material API
  @Input() action?: string;
  @Input() dismissible = true;
  @Input() position:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right' = 'bottom-center';
  @Input() icon?: string; // Custom icon support (e.g., 'check', 'warning', 'error', 'info')

  @Output() actionClicked = new EventEmitter<void>(); // Emit event when action is clicked
  @Output() closed = new EventEmitter<void>(); // Emit event when alert is closed

  isVisible = true;

  ngOnInit() {
    if (this.duration > 0) {
      setTimeout(() => {
        this.close();
      }, this.duration);
    }
  }

  close() {
    this.isVisible = false;
    this.closed.emit();
  }

  onAction() {
    this.actionClicked.emit();
    this.close();
  }

  getIcon(): string {
    // Default icons based on type if no custom icon is provided
    if (this.icon) {
      return this.icon;
    }
    switch (this.type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  }
}
