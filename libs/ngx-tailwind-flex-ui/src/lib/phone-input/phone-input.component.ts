import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnInit,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AsYouType, CountryCode } from 'libphonenumber-js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-phone-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './phone-input.component.html',
  styleUrls: ['./phone-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true,
    },
  ],
})
export class PhoneInputComponent implements ControlValueAccessor, OnInit {
  @Input() country: CountryCode = 'US';
  @Input() showCountryCode = false;
  @Input() showCountryFlag = false;
  @Input() format: 'e164' | 'international' | 'national' = 'international';
  @Input() disableDropdown = false;
  @Input() disableFormatting = false;
  @Input() displayStyle: 'inline' | 'stacked' = 'inline';

  @Output() phoneNumberChange = new EventEmitter<string>();

  phoneNumber = '';
  selectedCountryCode = '+1';
  isValid = true;

  countries = [
    { code: 'US', name: 'United States', dialCode: '+1' },
    { code: 'IN', name: 'India', dialCode: '+91' },
    { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
  ];

  // Suppress ESLint empty function warnings as these are ControlValueAccessor defaults
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  // Constructor removed since it's empty and unnecessary

  ngOnInit() {
    this.updateCountryCode(this.country);
  }

  updateCountryCode(countryCode: CountryCode) {
    const country = this.countries.find((c) => c.code === countryCode);
    if (country) {
      this.selectedCountryCode = country.dialCode;
      this.formatPhoneNumber();
    }
  }

  formatPhoneNumber() {
    if (!this.phoneNumber) {
      this.phoneNumber = '';
      this.isValid = true;
      this.emitValue('');
      return;
    }

    if (this.disableFormatting) {
      this.isValid = true;
      this.emitValue(this.phoneNumber);
      return;
    }

    const asYouType = new AsYouType({ defaultCountry: this.country });
    asYouType.input(this.phoneNumber);
    const parsedNumber = asYouType.getNumber();

    if (parsedNumber && parsedNumber.isValid()) {
      switch (this.format) {
        case 'e164':
          this.phoneNumber = parsedNumber.number as string;
          break;
        case 'national':
          this.phoneNumber = parsedNumber.formatNational();
          break;
        case 'international':
        default:
          this.phoneNumber = parsedNumber.formatInternational();
          break;
      }
      this.isValid = true;
    } else {
      this.isValid = false;
    }

    this.emitValue(this.phoneNumber);
  }

  onCountryChange(event: Event) {
    const countryCode = (event.target as HTMLSelectElement)
      .value as CountryCode;
    this.country = countryCode;
    this.updateCountryCode(countryCode);
    this.formatPhoneNumber();
  }

  markAsTouched() {
    this.onTouched();
  }

  private emitValue(value: string) {
    this.onChange(value);
    this.phoneNumberChange.emit(value);
  }

  writeValue(value: string): void {
    this.phoneNumber = value || '';
    this.formatPhoneNumber();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.phoneNumber = '';
    }
  }
}
