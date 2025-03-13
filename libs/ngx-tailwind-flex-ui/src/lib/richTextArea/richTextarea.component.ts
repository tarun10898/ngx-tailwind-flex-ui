import { CommonModule } from '@angular/common';
import { Input, ViewChild } from '@angular/core';
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  AfterViewInit,
  Renderer2,
} from '@angular/core';

interface SaveData {
  text: string;
  file: string | null;
  mentions: string[];
  hashtags: string[];
}

@Component({
  selector: 'lib-rich-textarea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './richTextarea.component.html',
  styleUrls: ['./richTextarea.component.css'],
})
export class RichTextAreaComponent implements AfterViewInit {
  @ViewChild('textArea', { static: false })
  textArea!: ElementRef<HTMLDivElement>;
  @ViewChild('mentionDropdown', { static: false })
  mentionDropdown!: ElementRef<HTMLDivElement>;
  @ViewChild('hashtagDropdown', { static: false })
  hashtagDropdown!: ElementRef<HTMLDivElement>;

  @Output() sendMessage = new EventEmitter<string>();
  @Output() fileAttached = new EventEmitter<File>();
  @Output() saveData = new EventEmitter<SaveData>();
  @Input() placeholder = 'Type your message...';

  showEmojiPicker = false;
  showMoreEmojis = false;
  showMentionDropdown = false;
  showHashtagDropdown = false;
  mentionList: string[] = ['@JohnDoe', '@JaneSmith', '@User123'];
  hashtagList: string[] = ['#Angular', '#Tailwind', '#Coding'];

  selectedFile: File | null = null;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    if (!this.textArea?.nativeElement) {
      console.warn('TextArea not initialized.');
      return;
    }
    const textAreaEl = this.textArea.nativeElement;
    if (!textAreaEl.innerText?.trim()) {
      textAreaEl.innerText = this.placeholder;
    }
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
  }

  onKeydown(event: KeyboardEvent) {
    this.clearPlaceholderIfNeeded();
    if (!this.textArea?.nativeElement) return;

    const textContent = this.textArea.nativeElement.innerText.trim();
    if (!textContent) return;

    if (event.key === ' ' || event.key === 'Enter') {
      this.showMentionDropdown = false;
      this.showHashtagDropdown = false;
    }
  }

  onInput() {
    this.clearPlaceholderIfNeeded();
    this.autoExpand();

    if (!this.textArea?.nativeElement) return;

    const textContent = this.textArea.nativeElement.innerText || '';
    const words = textContent.split(/\s+/);

    this.showMentionDropdown = false;
    this.showHashtagDropdown = false;

    // Check all words for mentions and hashtags
    words.forEach((word) => {
      if (word.startsWith('@')) {
        this.showMentionDropdown = true;
      }
      if (word.startsWith('#')) {
        this.showHashtagDropdown = true;
      }
    });

    if (this.showMentionDropdown || this.showHashtagDropdown) {
      this.updateDropdownPosition();
    }
  }

  insertEmoji(emoji: string) {
    if (this.textArea?.nativeElement) {
      this.textArea.nativeElement.innerText += emoji;
      this.autoExpand();
    }
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  toggleMoreEmojis() {
    this.showMoreEmojis = !this.showMoreEmojis;
  }

  updateDropdownPosition() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const textAreaRect = this.textArea?.nativeElement?.getBoundingClientRect();

    if (!textAreaRect) return;

    if (this.showMentionDropdown && this.mentionDropdown?.nativeElement) {
      this.renderer.setStyle(
        this.mentionDropdown.nativeElement,
        'top',
        `${rect.bottom - textAreaRect.top}px`
      );
      this.renderer.setStyle(
        this.mentionDropdown.nativeElement,
        'left',
        `${rect.left - textAreaRect.left}px`
      );
    }

    if (this.showHashtagDropdown && this.hashtagDropdown?.nativeElement) {
      this.renderer.setStyle(
        this.hashtagDropdown.nativeElement,
        'top',
        `${rect.bottom - textAreaRect.top}px`
      );
      this.renderer.setStyle(
        this.hashtagDropdown.nativeElement,
        'left',
        `${rect.left - textAreaRect.left}px`
      );
    }
  }

  selectMention(mention: string) {
    const text = this.textArea?.nativeElement?.innerText.trim();
    if (text && text.endsWith('@')) {
      this.textArea.nativeElement.innerText = text.slice(0, -1) + mention;
      this.showMentionDropdown = false;
      this.autoExpand();
    }
  }

  selectHashtag(hashtag: string) {
    const text = this.textArea?.nativeElement?.innerText.trim();
    if (text && text.endsWith('#')) {
      this.textArea.nativeElement.innerText = text.slice(0, -1) + hashtag;
      this.showHashtagDropdown = false;
      this.autoExpand();
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

    const extractedMentions = message.match(/@\w+/g) || [];
    const extractedHashtags = message.match(/#\w+/g) || [];

    const dataToSave: SaveData = {
      text: message,
      file: this.selectedFile ? this.selectedFile.name : null,
      mentions: extractedMentions,
      hashtags: extractedHashtags,
    };

    console.log('Saving Data:', dataToSave);
    this.saveData.emit(dataToSave);
  }
}
