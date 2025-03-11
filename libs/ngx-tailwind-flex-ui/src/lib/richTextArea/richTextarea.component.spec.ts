import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RichTextAreaComponent } from './richTextarea.component';

describe('RichTextAreaComponent', () => {
  let component: RichTextAreaComponent;
  let fixture: ComponentFixture<RichTextAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RichTextAreaComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    jest.clearAllMocks(); // ✅ Clears previous console logs
    fixture = TestBed.createComponent(RichTextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the placeholder text initially', () => {
    const textArea = fixture.debugElement.query(By.css('[contenteditable]'));
    expect(textArea.nativeElement.textContent.trim()).toBe(
      component.placeholder
    );
  });

  it('should clear placeholder text on focus', () => {
    const textArea = fixture.debugElement.query(By.css('[contenteditable]'));
    textArea.triggerEventHandler('focus', null);
    fixture.detectChanges();
    expect(textArea.nativeElement.textContent.trim()).toBe('');
  });

  it('should restore placeholder text on blur if empty', () => {
    const textArea = fixture.debugElement.query(By.css('[contenteditable]'));
    textArea.nativeElement.textContent = '';
    fixture.detectChanges();
    textArea.triggerEventHandler('blur', null);
    expect(textArea.nativeElement.textContent.trim()).toBe(
      component.placeholder
    );
  });

  it('should insert an emoji in the text area', () => {
    component.insertEmoji('😊');
    fixture.detectChanges();
    expect(component.textArea.nativeElement.textContent.includes('😊')).toBe(
      true
    );
  });

  it('should detect mentions and hashtags when typing', () => {
    const textArea = fixture.debugElement.query(By.css('[contenteditable]'));

    textArea.nativeElement.textContent = 'Hello @JohnDoe #Angular';
    component.onInput();
    fixture.detectChanges();

    expect(component.showMentionDropdown).toBe(true);
    expect(component.showHashtagDropdown).toBe(true);
  });

  it('should add mentions correctly to saved data', () => {
    jest.spyOn(console, 'log');

    component.textArea.nativeElement.textContent = 'Hello @JohnDoe #Angular';
    component.saveMessage();

    expect(console.log).toHaveBeenCalledWith(
      'Saving Data:',
      expect.objectContaining({
        mentions: ['@JohnDoe'],
        hashtags: ['#Angular'],
      })
    );
  });

  it('should not save an empty message', () => {
    jest.spyOn(console, 'log');

    component.textArea.nativeElement.textContent = '';
    component.saveMessage();

    expect(console.log).toHaveBeenCalledWith('Message is empty. Not saving.');
  });

  it('should correctly structure saved message data', () => {
    jest.spyOn(console, 'log').mockClear();

    component.textArea.nativeElement.textContent =
      '@JaneSmith #Tailwind Hello!';
    component.saveMessage();

    expect(console.log).toHaveBeenLastCalledWith(
      'Saving Data:',
      expect.objectContaining({
        text: '@JaneSmith #Tailwind Hello!',
        mentions: ['@JaneSmith'],
        hashtags: ['#Tailwind'],
        file: null,
      })
    );
  });

  it('should not allow duplicate @ or # symbols when selecting mentions/hashtags', () => {
    component.textArea.nativeElement.textContent = 'Hello @';
    component.selectMention('@JohnDoe');
    fixture.detectChanges();

    expect(component.textArea.nativeElement.textContent).toBe(
      'Hello @JohnDoe '
    );

    component.textArea.nativeElement.textContent = 'Hello #';
    component.selectHashtag('#Angular');
    fixture.detectChanges();

    expect(component.textArea.nativeElement.textContent).toBe(
      'Hello #Angular '
    );
  });

  it('should not allow duplicate @ or # symbols when selecting mentions/hashtags', () => {
    component.textArea.nativeElement.textContent = 'Hello @';
    component.selectMention('@JohnDoe');
    fixture.detectChanges();

    // ✅ Remove trailing space in expected value if it's unnecessary
    expect(component.textArea.nativeElement.textContent.trim()).toBe(
      'Hello @JohnDoe'
    );
  });
});
