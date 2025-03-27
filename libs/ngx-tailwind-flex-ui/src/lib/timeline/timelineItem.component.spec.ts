import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TimelineItemComponent } from './timelineItem.component';
import { CommonModule } from '@angular/common';

describe('TimelineItemComponent', () => {
  let component: TimelineItemComponent;
  let fixture: ComponentFixture<TimelineItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, TimelineItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render default pending item in vertical layout', () => {
    component.label = 'Event';
    component.timestamp = '12:00 PM';
    component.status = 'pending';
    component.orientation = 'vertical';
    fixture.detectChanges();

    const itemElement =
      fixture.nativeElement.querySelector('[role="listitem"]');
    console.log('Pending HTML:', itemElement.outerHTML);
    expect(itemElement).toBeTruthy();

    const markerElement = fixture.debugElement.query(
      By.css('.flex.items-center.justify-center')
    );
    console.log(
      'Pending Marker Classes:',
      markerElement.nativeElement.className
    );
    expect(
      markerElement.nativeElement.classList.contains('bg-gray-400')
    ).toBeTruthy();

    const labelElement = fixture.debugElement.query(
      By.css('.text-lg.font-semibold')
    );
    console.log('Label Element Found:', labelElement ? 'Yes' : 'No');
    console.log(
      'Pending Label Text:',
      labelElement ? labelElement.nativeElement.textContent.trim() : 'Not found'
    );
    console.log(
      'Pending Label HTML:',
      labelElement ? labelElement.nativeElement.outerHTML : 'Not found'
    );
    expect(labelElement).toBeTruthy();
    expect(labelElement.nativeElement.textContent.trim()).toBe('Event');

    const timestampElement = fixture.debugElement.query(By.css('.text-sm'));
    console.log('Timestamp Element Found:', timestampElement ? 'Yes' : 'No');
    console.log(
      'Pending Timestamp Text:',
      timestampElement
        ? timestampElement.nativeElement.textContent.trim()
        : 'Not found'
    );
    expect(timestampElement).toBeTruthy();
    expect(timestampElement.nativeElement.textContent.trim()).toBe('12:00 PM');
  });

  it('should render completed item in vertical layout', () => {
    component.status = 'completed';
    component.orientation = 'vertical';
    fixture.detectChanges();

    const markerElement = fixture.debugElement.query(
      By.css('.flex.items-center.justify-center')
    );
    console.log(
      'Completed Marker Classes:',
      markerElement.nativeElement.className
    );
    expect(
      markerElement.nativeElement.classList.contains('bg-green-500')
    ).toBeTruthy();
  });

  it('should render error item in vertical layout', () => {
    component.status = 'error';
    component.orientation = 'vertical';
    fixture.detectChanges();

    const markerElement = fixture.debugElement.query(
      By.css('.flex.items-center.justify-center')
    );
    console.log('Error Marker Classes:', markerElement.nativeElement.className);
    expect(
      markerElement.nativeElement.classList.contains('bg-red-500')
    ).toBeTruthy();
  });
});
