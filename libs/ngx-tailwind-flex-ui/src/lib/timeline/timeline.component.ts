import { Component, Input, type OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineItemComponent } from './timelineItem.component';

@Component({
  selector: 'lib-timeline',
  standalone: true,
  imports: [CommonModule, TimelineItemComponent],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
})
export class TimelineComponent implements OnChanges {
  @Input() items: Array<{
    icon?: string;
    label: string;
    timestamp: string;
    status: 'completed' | 'pending' | 'error';
  }> = [];
  @Input() orientation: 'vertical' | 'horizontal' = 'vertical';

  constructor() {
    console.log('TimelineComponent items:', this.items);
    console.log('TimelineComponent orientation:', this.orientation);
  }

  ngOnChanges() {
    console.log('TimelineComponent ngOnChanges items:', this.items);
    console.log('TimelineComponent ngOnChanges orientation:', this.orientation);
  }

  getIcon(icon: string | undefined): string {
    return icon ?? 'circle';
  }
}
