import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
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
  @ViewChild('textArea') textArea!: ElementRef;
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
    const textAreaEl = this.textArea.nativeElement;

    // ✅ Dynamically update placeholder text in the textarea
    if (!textAreaEl.textContent.trim()) {
      textAreaEl.textContent = this.placeholder;
    }
  }

  clearPlaceholderIfNeeded() {
    const textAreaEl = this.textArea.nativeElement;
    if (textAreaEl.textContent.trim() === this.placeholder) {
      textAreaEl.textContent = ''; // ✅ Clears the placeholder only if it's still present
    }
  }

  restorePlaceholderIfEmpty() {
    const textAreaEl = this.textArea.nativeElement;
    if (!textAreaEl.textContent.trim()) {
      textAreaEl.textContent = this.placeholder;
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
    const textContent = this.textArea.nativeElement.textContent.trim();

    // ✅ Ensure mentions and hashtags are tracked
    this.showMentionDropdown = textContent.includes('@') && event.key === '@';
    this.showHashtagDropdown = textContent.includes('#') && event.key === '#';

    // ✅ Close dropdowns if space or enter is pressed
    if (event.key === ' ' || event.key === 'Enter') {
      this.showMentionDropdown = false;
      this.showHashtagDropdown = false;
    }
  }

  onInput() {
    this.clearPlaceholderIfNeeded();
    this.autoExpand();

    const textContent = this.textArea.nativeElement.textContent.trim();

    // ✅ Ensure mentions and hashtags trigger the dropdown correctly
    this.showMentionDropdown = textContent.includes('@');
    this.showHashtagDropdown = textContent.includes('#');
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  toggleMoreEmojis() {
    this.showMoreEmojis = !this.showMoreEmojis;
  }

  insertEmoji(emoji: string) {
    this.clearPlaceholderIfNeeded();
    const textAreaEl = this.textArea.nativeElement;
    textAreaEl.textContent += emoji;
    this.showEmojiPicker = false;
    this.autoExpand();
  }

  selectMention(mention: string) {
    this.clearPlaceholderIfNeeded();
    const textAreaEl = this.textArea.nativeElement;
    let content = textAreaEl.textContent.trim();

    // ✅ Prevent duplicate `@` before inserting mention
    if (content.endsWith('@')) {
      content = content.slice(0, -1).trim();
    }
    textAreaEl.textContent = content + ' ' + mention + ' ';
    this.showMentionDropdown = false;
  }

  selectHashtag(hashtag: string) {
    this.clearPlaceholderIfNeeded();
    const textAreaEl = this.textArea.nativeElement;
    let content = textAreaEl.textContent.trim();

    // ✅ Prevent duplicate `#` before inserting hashtag
    if (content.endsWith('#')) {
      content = content.slice(0, -1).trim();
    }
    textAreaEl.textContent = content + ' ' + hashtag + ' ';
    this.showHashtagDropdown = false;
  }

  autoExpand() {
    this.renderer.setStyle(this.textArea.nativeElement, 'height', 'auto');
    this.renderer.setStyle(
      this.textArea.nativeElement,
      'height',
      this.textArea.nativeElement.scrollHeight + 'px'
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
    const message = this.textArea.nativeElement.textContent.trim();
    if (!message || message === this.placeholder) {
      console.log('Message is empty. Not saving.');
      return;
    }

    // ✅ Extract mentions dynamically
    const extractedMentions = message.match(/@\w+/g) || [];

    // ✅ Extract hashtags dynamically
    const extractedHashtags = message.match(/#\w+/g) || [];

    const dataToSave: SaveData = {
      text: message,
      file: this.selectedFile ? this.selectedFile.name : null,
      mentions: extractedMentions, // ✅ Now captures dynamic mentions
      hashtags: extractedHashtags, // ✅ Now captures dynamic hashtags
    };

    console.log('Saving Data:', dataToSave);
    this.saveData.emit(dataToSave);
  }
}
