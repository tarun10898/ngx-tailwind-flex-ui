import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RichTextAreaComponent } from './richTextarea.component';

describe('RichTextAreaComponent', () => {
  let component: RichTextAreaComponent;
  let fixture: ComponentFixture<RichTextAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RichTextAreaComponent], // ✅ FIXED: Used imports instead of declarations
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RichTextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set placeholder text initially', async () => {
    const textArea = fixture.debugElement.query(By.css('[contenteditable]'));

    await fixture.whenStable(); // Ensure Angular updates the view
    fixture.detectChanges();

    expect(textArea.nativeElement.textContent.trim()).toBe(
      component.placeholder
    );
  });

  it('should clear placeholder text on focus', async () => {
    const textArea = fixture.debugElement.query(By.css('[contenteditable]'));

    textArea.nativeElement.textContent = component.placeholder; // Ensure placeholder exists
    fixture.detectChanges();

    textArea.triggerEventHandler('focus', null);
    await fixture.whenStable(); // Ensure Angular updates the view
    fixture.detectChanges();

    expect(textArea.nativeElement.textContent.trim()).toBe('');
  });

  it('should restore placeholder text when blurred and empty', async () => {
    const textArea = fixture.debugElement.query(By.css('[contenteditable]'));

    textArea.nativeElement.textContent = ''; // Simulate empty text
    fixture.detectChanges();

    textArea.triggerEventHandler('blur', null);
    await fixture.whenStable(); // Ensure Angular updates the view
    fixture.detectChanges();

    expect(textArea.nativeElement.textContent.trim()).toBe(
      component.placeholder
    );
  });

  it('should emit sendMessage event when Enter is pressed', () => {
    jest.spyOn(component.sendMessage, 'emit'); // ✅ FIXED
    const textArea = fixture.debugElement.query(By.css('[contenteditable]'));

    textArea.nativeElement.textContent = 'Hello, world!';
    fixture.detectChanges();

    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      shiftKey: false,
    });
    textArea.triggerEventHandler('keydown', event);

    expect(component.sendMessage.emit).toHaveBeenCalledWith('Hello, world!');
  });

  it('should emit fileAttached event when a file is selected', () => {
    const spy = jest.spyOn(component.fileAttached, 'emit'); // ✅ Use Jest's spyOn

    const input = fixture.debugElement.query(By.css('input[type="file"]'));
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const event = { target: { files: [file] } } as unknown as Event;

    input.triggerEventHandler('change', event);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(file); // ✅ Ensure the event is emitted correctly
  });

  it('should insert emoji at cursor position when selected', () => {
    const textArea = fixture.debugElement.query(By.css('[contenteditable]'));

    textArea.nativeElement.textContent = 'Hello';
    fixture.detectChanges();

    component.insertEmoji('😊');
    fixture.detectChanges();

    expect(textArea.nativeElement.textContent.includes('😊')).toBe(true);
  });

  it('should set placeholder text initially', async () => {
    const textArea = fixture.debugElement.query(By.css('[contenteditable]'));

    await fixture.whenStable(); // Wait for Angular updates
    fixture.detectChanges();

    expect(textArea.nativeElement.textContent.trim()).toBe(
      component.placeholder
    );
  });
});
