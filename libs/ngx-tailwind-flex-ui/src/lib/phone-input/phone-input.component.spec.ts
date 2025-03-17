import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhoneInputComponent } from './phone-input.component';

describe('PhoneInputComponent', () => {
  let component: PhoneInputComponent;
  let fixture: ComponentFixture<PhoneInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhoneInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhoneInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format phone number for US in international format', () => {
    component.country = 'US';
    component.phoneNumber = '2025550123';
    component.formatPhoneNumber();
    expect(component.phoneNumber).toContain('+1 202 555 0123'); // Updated expectation
    expect(component.isValid).toBe(true);
  });

  it('should not format when disableFormatting is true', () => {
    component.disableFormatting = true;
    component.phoneNumber = '2025550123';
    component.formatPhoneNumber();
    expect(component.phoneNumber).toBe('2025550123');
    expect(component.isValid).toBe(true);
  });

  it('should output national format', () => {
    component.country = 'US';
    component.format = 'national';
    component.phoneNumber = '2025550123';
    component.formatPhoneNumber();
    expect(component.phoneNumber).toContain('(202) 555-0123');
  });
});
