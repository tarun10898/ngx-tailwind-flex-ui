import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'lib-rich-textarea', // ✅ Fixed selector to start with "lib"
  standalone: true,
  imports: [CommonModule], // ✅ Ensured CommonModule is imported for *ngIf
  templateUrl: './richTextarea.component.html',
  styleUrls: ['./richTextarea.component.css'],
})
export class RichTextAreaComponent implements AfterViewInit {
  @ViewChild('textArea') textArea!: ElementRef;
  @Output() sendMessage = new EventEmitter<string>();
  @Output() fileAttached = new EventEmitter<File>();

  placeholder = 'Type your message...';
  showEmojiPicker = false;
  showMoreEmojis = false;

  /** ✅ Clears the placeholder when the user focuses or enters content */
  clearPlaceholderIfNeeded() {
    const textAreaEl = this.textArea.nativeElement;
    if (textAreaEl.textContent.trim() === this.placeholder) {
      textAreaEl.textContent = '';
    }
  }

  /** ✅ Restores placeholder only if text is completely empty */
  restorePlaceholderIfEmpty() {
    const textAreaEl = this.textArea.nativeElement;
    if (textAreaEl.textContent.trim() === '') {
      textAreaEl.textContent = this.placeholder;
    }
  }

  onKeydown(event: KeyboardEvent) {
    this.clearPlaceholderIfNeeded(); // ✅ Clears placeholder when user types

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const message = this.textArea.nativeElement.textContent.trim();
      if (message && message !== this.placeholder) {
        this.sendMessage.emit(message);
        this.textArea.nativeElement.textContent = ''; // ✅ Clears text after sending
        this.restorePlaceholderIfEmpty(); // ✅ Restores placeholder after sending
      }
    }
  }

  onFocus() {
    this.clearPlaceholderIfNeeded(); // ✅ Clears placeholder on focus
  }

  onBlur() {
    this.restorePlaceholderIfEmpty(); // ✅ Restores placeholder on blur if empty
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  toggleMoreEmojis() {
    this.showMoreEmojis = !this.showMoreEmojis;
  }

  insertEmoji(emoji: string) {
    const textAreaEl = this.textArea.nativeElement;
    this.clearPlaceholderIfNeeded(); // ✅ Clears placeholder when an emoji is inserted

    if (textAreaEl) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(emoji));
        selection.collapseToEnd();
      } else {
        textAreaEl.textContent += emoji;
      }
    }

    this.showEmojiPicker = false; // ✅ Close emoji picker after selection
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.fileAttached.emit(input.files[0]);
    }
  }

  ngAfterViewInit() {
    // ✅ Ensure placeholder is set only if text is empty
    if (!this.textArea.nativeElement.textContent.trim()) {
      this.textArea.nativeElement.textContent = this.placeholder;
    }
  }
}
