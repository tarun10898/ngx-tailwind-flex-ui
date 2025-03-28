import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertComponent } from './alert.component';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertComponent, CommonModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the message', () => {
    component.message = 'Test alert';
    fixture.detectChanges();
    const messageElement = fixture.nativeElement.querySelector('.message');
    expect(messageElement.textContent.trim()).toBe('Test alert');
  });

  it('should apply correct type class', () => {
    component.type = 'success';
    fixture.detectChanges();
    const alertElement = fixture.nativeElement.querySelector('.alert');
    expect(alertElement.classList).toContain('bg-green-100');
  });

  it('should display default icon based on type', () => {
    component.type = 'success';
    fixture.detectChanges();
    const iconElement = fixture.nativeElement.querySelector('.material-icons');
    expect(iconElement.textContent.trim()).toBe('check_circle');
    expect(iconElement.classList).toContain('text-green-600');
  });

  it('should display custom icon if provided', () => {
    component.type = 'success';
    component.icon = 'star';
    fixture.detectChanges();
    const iconElement = fixture.nativeElement.querySelector('.material-icons');
    expect(iconElement.textContent.trim()).toBe('star');
  });

  it('should display pizza icon if provided', () => {
    component.type = 'info';
    component.icon = 'pizza';
    fixture.detectChanges();
    const iconElement = fixture.nativeElement.querySelector('.material-icons');
    expect(iconElement.textContent.trim()).toBe('pizza');
  });

  it('should display mood icon if provided', () => {
    component.type = 'info';
    component.icon = 'mood';
    fixture.detectChanges();
    const iconElement = fixture.nativeElement.querySelector('.material-icons');
    expect(iconElement.textContent.trim()).toBe('mood');
  });

  it('should display coffee icon if provided', () => {
    component.type = 'info';
    component.icon = 'coffee';
    fixture.detectChanges();
    const iconElement = fixture.nativeElement.querySelector('.material-icons');
    expect(iconElement.textContent.trim()).toBe('coffee');
  });

  it('should display cloud icon if provided', () => {
    component.type = 'info';
    component.icon = 'cloud';
    fixture.detectChanges();
    const iconElement = fixture.nativeElement.querySelector('.material-icons');
    expect(iconElement.textContent.trim()).toBe('cloud');
  });

  it('should display music_note icon if provided', () => {
    component.type = 'info';
    component.icon = 'music_note';
    fixture.detectChanges();
    const iconElement = fixture.nativeElement.querySelector('.material-icons');
    expect(iconElement.textContent.trim()).toBe('music_note');
  });

  it('should display pets icon if provided', () => {
    component.type = 'info';
    component.icon = 'pets';
    fixture.detectChanges();
    const iconElement = fixture.nativeElement.querySelector('.material-icons');
    expect(iconElement.textContent.trim()).toBe('pets');
  });

  it('should display rocket icon if provided', () => {
    component.type = 'info';
    component.icon = 'rocket';
    fixture.detectChanges();
    const iconElement = fixture.nativeElement.querySelector('.material-icons');
    expect(iconElement.textContent.trim()).toBe('rocket');
  });

  it('should display beach_access icon if provided', () => {
    component.type = 'info';
    component.icon = 'beach_access';
    fixture.detectChanges();
    const iconElement = fixture.nativeElement.querySelector('.material-icons');
    expect(iconElement.textContent.trim()).toBe('beach_access');
  });

  it('should hide after duration', (done) => {
    component.duration = 100;
    component.ngOnInit();
    setTimeout(() => {
      expect(component.isVisible).toBeFalsy();
      done();
    }, 150);
  });

  it('should close when dismissible button is clicked', () => {
    component.dismissible = true;
    component.isVisible = true;
    fixture.detectChanges();
    const closeButton = fixture.nativeElement.querySelector(
      'button[aria-label="Close alert"]'
    );
    closeButton.click();
    expect(component.isVisible).toBeFalsy();
  });

  it('should emit closed event when closed', () => {
    jest.spyOn(component.closed, 'emit');
    component.close();
    expect(component.closed.emit).toHaveBeenCalled();
  });

  it('should display action button when provided', () => {
    component.action = 'Undo';
    fixture.detectChanges();
    const actionButton = fixture.nativeElement.querySelector(
      'button:not([aria-label="Close alert"])'
    );
    expect(actionButton.textContent.trim()).toBe('Undo');
  });

  it('should emit actionClicked event when action is clicked', () => {
    component.action = 'Undo';
    jest.spyOn(component.actionClicked, 'emit');
    fixture.detectChanges();
    const actionButton = fixture.nativeElement.querySelector(
      'button:not([aria-label="Close alert"])'
    );
    actionButton.click();
    expect(component.actionClicked.emit).toHaveBeenCalled();
  });

  it('should apply correct position class', () => {
    component.position = 'top-right';
    fixture.detectChanges();
    const alertElement = fixture.nativeElement.querySelector('.alert');
    expect(alertElement.classList).toContain('top-4');
    expect(alertElement.classList).toContain('right-4');
  });

  it('should have correct ARIA attributes', () => {
    component.message = 'Test alert';
    component.type = 'success';
    fixture.detectChanges();
    const alertElement = fixture.nativeElement.querySelector('.alert');
    expect(alertElement.getAttribute('role')).toBe('alert');
    expect(alertElement.getAttribute('aria-live')).toBe('polite');
    expect(alertElement.getAttribute('aria-label')).toBe(
      'success alert: Test alert'
    );
  });
});
