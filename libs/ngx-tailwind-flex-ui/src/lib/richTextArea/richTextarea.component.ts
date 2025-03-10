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

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const message = this.textArea.nativeElement.textContent.trim();
      if (message && message !== this.placeholder) {
        this.sendMessage.emit(message);
        this.textArea.nativeElement.textContent = ''; // Clear after sending
      }
    }
  }

  onFocus() {
    const textAreaEl = this.textArea?.nativeElement;
    if (textAreaEl.textContent.trim() === this.placeholder) {
      textAreaEl.textContent = ''; // Clear placeholder on focus
    }
  }

  onBlur() {
    const textAreaEl = this.textArea?.nativeElement;
    if (textAreaEl.textContent.trim() === '') {
      textAreaEl.textContent = this.placeholder; // Restore placeholder if input is empty
    }
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  insertEmoji(emoji: string) {
    const textAreaEl = this.textArea?.nativeElement;
    if (textAreaEl) {
      const selection = window.getSelection();

      if (selection && selection.rangeCount > 0) {
        // ✅ Ensure selection exists
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(emoji));
        selection.collapseToEnd();
      } else {
        textAreaEl.textContent += emoji;
      }
    }
    this.showEmojiPicker = false;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.fileAttached.emit(input.files[0]);
    }
  }

  ngAfterViewInit() {
    // Ensure placeholder is set only if text is empty
    if (!this.textArea.nativeElement.textContent.trim()) {
      this.textArea.nativeElement.textContent = this.placeholder;
    }
  }
}
