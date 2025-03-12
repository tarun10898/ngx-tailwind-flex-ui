import { CommonModule } from '@angular/common';
import { Input, ViewChild, forwardRef } from '@angular/core';
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  AfterViewInit,
  Renderer2,
  ChangeDetectorRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

interface SaveData {
  text: string;
  file: string | null;
  mentions: string[];
  hashtags: string[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

@Component({
  selector: 'lib-rich-textarea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './richTextarea.component.html',
  styleUrls: ['./richTextarea.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextAreaComponent),
      multi: true,
    },
  ],
})
export class RichTextAreaComponent
  implements AfterViewInit, ControlValueAccessor
{
  @ViewChild('textArea', { static: false })
  textArea!: ElementRef<HTMLDivElement>;
  @ViewChild('mentionDropdown', { static: false })
  mentionDropdown!: ElementRef<HTMLDivElement>;
  @ViewChild('hashtagDropdown', { static: false })
  hashtagDropdown!: ElementRef<HTMLDivElement>;
  @ViewChild('commandDropdown', { static: false })
  commandDropdown!: ElementRef<HTMLDivElement>;
  @ViewChild('emojiButton', { static: false })
  emojiButton!: ElementRef<HTMLButtonElement>;

  @Input() placeholder = 'Use Markdown to format your comment';
  @Input() enableMarkdown = true;
  @Input() enableAttachments = true;
  @Input() enableEmojis = true;
  @Input() set theme(value: 'light' | 'dark') {
    this._theme = value;
    this.cdr.detectChanges();
  }
  get theme(): 'light' | 'dark' {
    return this._theme;
  }
  private _theme: 'light' | 'dark' = 'dark';

  @Output() sendMessage = new EventEmitter<string>();
  @Output() fileAttached = new EventEmitter<File>();
  @Output() saveData = new EventEmitter<SaveData>();

  showEmojiPicker = false;
  showMoreEmojis = false;
  showMentionDropdown = false;
  showHashtagDropdown = false;
  showCommandDropdown = false;
  activeTab: 'write' | 'preview' = 'write';
  mentionList: string[] = ['@JohnDoe', '@JaneSmith', '@User123'];
  hashtagList: string[] = ['#Angular', '#Tailwind', '#Coding'];
  commandList: string[] = ['/help', '/gpt', '/info'];
  emojiPickerStyles: { [key: string]: string } = {};

  selectedFile: File | null = null;
  private onChange: (value: string) => void = noop;
  private onTouched: () => void = noop;

  constructor(private renderer: Renderer2, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    if (!this.textArea?.nativeElement) {
      console.warn('TextArea not initialized.');
      return;
    }
    const textAreaEl = this.textArea.nativeElement;
    if (!textAreaEl.innerText?.trim()) {
      textAreaEl.innerText = this.placeholder;
    }
    this.updateValue();
  }

  clearPlaceholderIfNeeded() {
    const textContent = this.textArea?.nativeElement?.innerText?.trim() || '';
    if (textContent === this.placeholder) {
      this.textArea.nativeElement.innerText = '';
    }
  }

  restorePlaceholderIfEmpty() {
    const textContent = this.textArea?.nativeElement?.innerText?.trim() || '';
    if (!textContent) {
      this.textArea.nativeElement.innerText = this.placeholder;
    }
  }

  onFocus() {
    this.clearPlaceholderIfNeeded();
  }

  onBlur() {
    this.restorePlaceholderIfEmpty();
    this.onTouched();
    this.updateValue();
  }

  onKeydown(event: KeyboardEvent) {
    this.clearPlaceholderIfNeeded();
    if (!this.textArea?.nativeElement) return;

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.saveMessage();
    } else if (event.ctrlKey && this.enableMarkdown) {
      this.handleFormattingShortcuts(event);
    } else if (event.key === ' ' || event.key === 'Enter') {
      this.showMentionDropdown = false;
      this.showHashtagDropdown = false;
      this.showCommandDropdown = false;
    }
  }

  handleFormattingShortcuts(event: KeyboardEvent) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (selectedText) {
      event.preventDefault();
      if (event.key === 'b') this.applyFormatting('**', selectedText);
      else if (event.key === 'i') this.applyFormatting('_', selectedText);
      else if (event.key === 'k') this.applyFormatting('~~', selectedText);
      else if (event.key === '`') this.applyFormatting('`', selectedText);
    }
  }

  applyFormatting(wrapper: string, text?: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = text || range.toString();
    if (selectedText) {
      range.deleteContents();
      range.insertNode(
        document.createTextNode(`${wrapper}${selectedText}${wrapper}`)
      );
      this.onInput();
    }
  }

  onInput() {
    this.clearPlaceholderIfNeeded();
    this.autoExpand();
    this.updateValue();

    if (!this.textArea?.nativeElement) return;

    const textContent = this.textArea.nativeElement.innerText || '';
    const cursorPos = this.getCursorPosition();
    const word = this.getWordAtCursor(textContent, cursorPos);

    this.showMentionDropdown = word.startsWith('@');
    this.showHashtagDropdown = word.startsWith('#');
    this.showCommandDropdown = word.startsWith('/');

    if (
      this.showMentionDropdown ||
      this.showHashtagDropdown ||
      this.showCommandDropdown
    ) {
      this.updateDropdownPosition();
    } else {
      this.showMentionDropdown =
        this.showHashtagDropdown =
        this.showCommandDropdown =
          false;
    }
  }

  getCursorPosition(): number {
    const selection = window.getSelection();
    return selection?.focusOffset || 0;
  }

  getWordAtCursor(text: string, pos: number): string {
    const words = text.substring(0, pos).split(/\s+/);
    return words[words.length - 1] || '';
  }

  insertEmoji(emoji: string) {
    if (this.textArea?.nativeElement) {
      this.insertText(emoji);
      this.showEmojiPicker = false;
      this.autoExpand();
    }
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (this.showEmojiPicker) {
      this.updateEmojiPickerPosition();
    }
  }

  toggleMoreEmojis() {
    this.showMoreEmojis = !this.showMoreEmojis;
  }

  updateEmojiPickerPosition() {
    if (!this.emojiButton?.nativeElement) return;

    const buttonRect = this.emojiButton.nativeElement.getBoundingClientRect();
    const pickerWidth = 224; // Approximate width of the emoji picker (w-56 = 224px)

    this.emojiPickerStyles = {
      top: `${buttonRect.top}px`,
      left: `${buttonRect.left - pickerWidth - 10}px`, // Position to the left with a 10px gap
    };
  }

  updateDropdownPosition() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const textAreaRect = this.textArea?.nativeElement?.getBoundingClientRect();

    if (!textAreaRect) return;

    const dropdowns = [
      { condition: this.showMentionDropdown, element: this.mentionDropdown },
      { condition: this.showHashtagDropdown, element: this.hashtagDropdown },
      { condition: this.showCommandDropdown, element: this.commandDropdown },
    ];

    dropdowns.forEach(({ condition, element }) => {
      if (condition && element?.nativeElement) {
        this.renderer.setStyle(
          element.nativeElement,
          'top',
          `${rect.bottom - textAreaRect.top + 5}px`
        );
        this.renderer.setStyle(
          element.nativeElement,
          'left',
          `${rect.left - textAreaRect.left}px`
        );
      }
    });
  }

  selectMention(mention: string) {
    this.insertText(mention + ' ');
    this.showMentionDropdown = false;
  }

  selectHashtag(hashtag: string) {
    this.insertText(hashtag + ' ');
    this.showHashtagDropdown = false;
  }

  selectCommand(command: string) {
    this.insertText(command + ' ');
    this.showCommandDropdown = false;
  }

  insertText(text: string) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      this.onInput();
    }
  }

  autoExpand() {
    if (!this.textArea?.nativeElement) return;
    this.renderer.setStyle(this.textArea.nativeElement, 'height', 'auto');
    this.renderer.setStyle(
      this.textArea.nativeElement,
      'height',
      `${this.textArea.nativeElement.scrollHeight}px`
    );
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.fileAttached.emit(this.selectedFile);
    }
  }

  saveMessage() {
    const message = this.textArea?.nativeElement?.innerText?.trim();
    if (!message || message === this.placeholder) {
      console.log('Message is empty. Not saving.');
      return;
    }

    const extractedMentions = (message.match(/@\w+/g) || []).filter(
      (m, i, arr) => arr.indexOf(m) === i
    );
    const extractedHashtags = (message.match(/#\w+/g) || []).filter(
      (h, i, arr) => arr.indexOf(h) === i
    );

    const dataToSave: SaveData = {
      text: message,
      file: this.selectedFile ? this.selectedFile.name : null,
      mentions: extractedMentions,
      hashtags: extractedHashtags,
    };

    console.log('Saving Data:', dataToSave);
    this.saveData.emit(dataToSave);
    this.sendMessage.emit(message);

    this.textArea.nativeElement.innerText = '';
    this.selectedFile = null;
    this.restorePlaceholderIfEmpty();
    this.autoExpand();
  }

  switchTab(tab: 'write' | 'preview') {
    this.activeTab = tab;
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
  }

  writeValue(value: string): void {
    if (this.textArea?.nativeElement) {
      this.textArea.nativeElement.innerText = value || this.placeholder;
      this.updateValue();
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private updateValue() {
    const value = this.textArea?.nativeElement?.innerText?.trim() || '';
    this.onChange(value !== this.placeholder ? value : '');
  }
}
