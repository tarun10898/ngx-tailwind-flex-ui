import { Component, Input, type OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-timeline-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timelineItem.component.html',
  styleUrls: ['./timelineItem.component.css'],
})
export class TimelineItemComponent implements OnChanges {
  @Input() icon = 'circle';
  @Input() label = '';
  @Input() timestamp = '';
  @Input() status: 'completed' | 'pending' | 'error' = 'pending';
  @Input() orientation: 'vertical' | 'horizontal' = 'vertical';

  constructor() {
    console.log('TimelineItemComponent inputs:', {
      icon: this.icon,
      label: this.label,
      timestamp: this.timestamp,
      status: this.status,
      orientation: this.orientation,
    });
  }

  ngOnChanges() {
    console.log('TimelineItemComponent ngOnChanges inputs:', {
      icon: this.icon,
      label: this.label,
      timestamp: this.timestamp,
      status: this.status,
      orientation: this.orientation,
    });
  }
}
