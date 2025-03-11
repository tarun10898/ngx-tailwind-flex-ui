import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RichTextAreaComponent } from './richTextarea.component';
import { ElementRef, Renderer2 } from '@angular/core';

// Helper function to safely set private renderer
function setRenderer(
  component: RichTextAreaComponent,
  renderer: Renderer2
): void {
  // Use type assertion with unknown first, then to a type with renderer
  const target = component as unknown as { renderer: Renderer2 };
  target.renderer = renderer;
}

describe('RichTextAreaComponent', () => {
  let component: RichTextAreaComponent;
  let fixture: ComponentFixture<RichTextAreaComponent>;
  let mockRenderer: Renderer2;

  beforeEach(async () => {
    mockRenderer = {
      setStyle: jest.fn(),
    } as unknown as Renderer2;

    await TestBed.configureTestingModule({
      imports: [CommonModule, RichTextAreaComponent],
      providers: [{ provide: Renderer2, useValue: mockRenderer }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RichTextAreaComponent);
    component = fixture.componentInstance;
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set the placeholder text initially', () => {
    const mockTextArea = document.createElement('div');
    mockTextArea.setAttribute('contenteditable', 'true');
    mockTextArea.innerText = '';
    component.textArea = new ElementRef<HTMLDivElement>(mockTextArea);
    component.ngAfterViewInit();
    expect(component.textArea.nativeElement.innerText.trim()).toBe(
      component.placeholder
    );
  });

  it('should clear placeholder text on focus', () => {
    const mockTextArea = document.createElement('div');
    mockTextArea.setAttribute('contenteditable', 'true');
    mockTextArea.innerText = component.placeholder;
    component.textArea = new ElementRef<HTMLDivElement>(mockTextArea);
    mockTextArea.dispatchEvent(new Event('focus'));
    component.onFocus();
    expect(mockTextArea.innerText.trim()).toBe('');
  });

  it('should restore placeholder text on blur if empty', () => {
    const mockTextArea = document.createElement('div');
    mockTextArea.setAttribute('contenteditable', 'true');
    mockTextArea.innerText = '';
    component.textArea = new ElementRef<HTMLDivElement>(mockTextArea);
    mockTextArea.dispatchEvent(new Event('blur'));
    component.onBlur();
    expect(mockTextArea.innerText.trim()).toBe(component.placeholder);
  });

  it('should insert an emoji into the text area', () => {
    const mockTextArea = document.createElement('div');
    mockTextArea.setAttribute('contenteditable', 'true');
    component.textArea = new ElementRef<HTMLDivElement>(mockTextArea);
    component.insertEmoji('😊');
    expect(mockTextArea.innerText.includes('😊')).toBe(true);
  });

  it('should detect mentions and hashtags when typing', () => {
    const mockTextArea = document.createElement('div');
    mockTextArea.setAttribute('contenteditable', 'true');
    mockTextArea.innerText = 'Hello @JohnDoe #Angular';
    component.textArea = new ElementRef<HTMLDivElement>(mockTextArea);
    component.onInput();
    fixture.detectChanges();
    expect(component.showMentionDropdown).toBe(true);
    expect(component.showHashtagDropdown).toBe(true);
  });

  it('should correctly extract mentions and hashtags from input', () => {
    jest.spyOn(console, 'log');
    const mockTextArea = document.createElement('div');
    mockTextArea.setAttribute('contenteditable', 'true');
    mockTextArea.innerText = 'Hello @JohnDoe #Angular';
    component.textArea = new ElementRef<HTMLDivElement>(mockTextArea);
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
    const mockTextArea = document.createElement('div');
    mockTextArea.setAttribute('contenteditable', 'true');
    mockTextArea.innerText = '';
    component.textArea = new ElementRef<HTMLDivElement>(mockTextArea);
    component.saveMessage();
    expect(console.log).toHaveBeenCalledWith('Message is empty. Not saving.');
  });

  it('should structure saved message data correctly', () => {
    jest.spyOn(console, 'log');
    const mockTextArea = document.createElement('div');
    mockTextArea.setAttribute('contenteditable', 'true');
    mockTextArea.innerText = '@JaneSmith #Tailwind Hello!';
    component.textArea = new ElementRef<HTMLDivElement>(mockTextArea);
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
    const mockTextArea = document.createElement('div');
    mockTextArea.setAttribute('contenteditable', 'true');
    component.textArea = new ElementRef<HTMLDivElement>(mockTextArea);

    mockTextArea.innerText = 'Hello @';
    component.selectMention('@JohnDoe');
    expect(mockTextArea.innerText.trim()).toBe('Hello @JohnDoe');

    mockTextArea.innerText = 'Hello #';
    component.selectHashtag('#Angular');
    expect(mockTextArea.innerText.trim()).toBe('Hello #Angular');
  });

  it('should update dropdown position correctly when typing @ or #', () => {
    jest.spyOn(window, 'getSelection').mockReturnValue({
      rangeCount: 1,
      getRangeAt: () => ({
        getBoundingClientRect: () => ({
          top: 100,
          bottom: 120,
          left: 200,
          right: 220,
        }),
      }),
    } as unknown as Selection);

    const mockTextArea = document.createElement('div');
    mockTextArea.setAttribute('contenteditable', 'true');
    mockTextArea.innerText = 'Hello @JohnDoe';
    component.textArea = new ElementRef<HTMLDivElement>(mockTextArea);
    component.onInput();
    fixture.detectChanges();
    expect(component.showMentionDropdown).toBe(true);
    expect(component.showHashtagDropdown).toBe(false);
  });

  it('should close dropdowns when space or enter is pressed', () => {
    const mockTextArea = document.createElement('div');
    mockTextArea.setAttribute('contenteditable', 'true');
    component.textArea = new ElementRef<HTMLDivElement>(mockTextArea);

    mockTextArea.innerText = 'Hello @JohnDoe';
    component.onKeydown(new KeyboardEvent('keydown', { key: ' ' }));
    expect(component.showMentionDropdown).toBe(false);

    mockTextArea.innerText = 'Hello #Angular';
    component.onKeydown(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(component.showHashtagDropdown).toBe(false);
  });

  it('should emit saveData correctly without file', () => {
    jest.spyOn(component.saveData, 'emit');
    const mockTextArea = document.createElement('div');
    mockTextArea.setAttribute('contenteditable', 'true');
    mockTextArea.innerText = 'Hello @JohnDoe #Angular';
    component.textArea = new ElementRef<HTMLDivElement>(mockTextArea);
    component.selectedFile = null;
    component.saveMessage();
    expect(component.saveData.emit).toHaveBeenCalledWith({
      text: 'Hello @JohnDoe #Angular',
      file: null,
      mentions: ['@JohnDoe'],
      hashtags: ['#Angular'],
    });
  });

  it('should emit saveData correctly with file', () => {
    jest.spyOn(component.saveData, 'emit');
    const mockFile = new File(['content'], 'test-file.txt', {
      type: 'text/plain',
    });
    component.selectedFile = mockFile;
    const mockTextArea = document.createElement('div');
    mockTextArea.setAttribute('contenteditable', 'true');
    mockTextArea.innerText = 'Hello @JohnDoe #Angular';
    component.textArea = new ElementRef<HTMLDivElement>(mockTextArea);
    component.saveMessage();
    expect(component.saveData.emit).toHaveBeenCalledWith({
      text: 'Hello @JohnDoe #Angular',
      file: 'test-file.txt',
      mentions: ['@JohnDoe'],
      hashtags: ['#Angular'],
    });
  });

  it('should auto-expand the text area', () => {
    const mockTextArea = document.createElement('div');
    mockTextArea.setAttribute('contenteditable', 'true');
    mockTextArea.innerText = 'Mock content to trigger scrollHeight';
    Object.defineProperty(mockTextArea, 'scrollHeight', {
      value: 100,
      configurable: true,
    });
    component.textArea = new ElementRef<HTMLDivElement>(mockTextArea);

    // Store original renderer and set mock
    const originalRenderer = TestBed.inject(Renderer2); // Get the injected renderer
    setRenderer(component, mockRenderer);

    const rendererSpy = jest.spyOn(mockRenderer, 'setStyle');
    component.autoExpand();

    // Restore original renderer
    setRenderer(component, originalRenderer);

    expect(rendererSpy).toHaveBeenCalledWith(mockTextArea, 'height', 'auto');
    expect(rendererSpy).toHaveBeenCalledWith(mockTextArea, 'height', '100px');
  });

  it('should toggle emoji picker visibility', () => {
    fixture.detectChanges();
    expect(component.showEmojiPicker).toBe(false);
    component.toggleEmojiPicker();
    expect(component.showEmojiPicker).toBe(true);
    component.toggleEmojiPicker();
    expect(component.showEmojiPicker).toBe(false);
  });

  it('should not show dropdowns for empty input', () => {
    const mockTextArea = document.createElement('div');
    mockTextArea.setAttribute('contenteditable', 'true');
    mockTextArea.innerText = '';
    component.textArea = new ElementRef<HTMLDivElement>(mockTextArea);
    component.onInput();
    fixture.detectChanges();
    expect(component.showMentionDropdown).toBe(false);
    expect(component.showHashtagDropdown).toBe(false);
  });
});
