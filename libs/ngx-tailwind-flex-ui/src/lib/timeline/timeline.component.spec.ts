import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineComponent } from './timeline.component';
import { CommonModule } from '@angular/common';
import { TimelineItemComponent } from './timelineItem.component';

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineComponent, CommonModule, TimelineItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render vertical layout by default', () => {
    component.items = [
      {
        label: 'Event 1',
        timestamp: '10:00 AM',
        status: 'completed',
        icon: 'check',
      },
    ];
    fixture.detectChanges();
    const timeline = fixture.nativeElement.querySelector('div[role="list"]');
    expect(timeline.classList.contains('flex-col')).toBeTruthy();
    expect(timeline.getAttribute('role')).toBe('list');
  });

  it('should render horizontal layout when orientation is horizontal', () => {
    component.orientation = 'horizontal';
    component.items = [
      {
        label: 'Event 1',
        timestamp: '10:00 AM',
        status: 'completed',
        icon: 'check',
      },
    ];
    fixture.detectChanges();
    const timeline = fixture.nativeElement.querySelector('div[role="list"]');
    expect(timeline.classList.contains('flex-row')).toBeTruthy();
  });
});
