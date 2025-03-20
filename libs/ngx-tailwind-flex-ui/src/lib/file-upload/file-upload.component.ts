import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'lib-file-upload',
  standalone: true,
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  imports: [CommonModule],
})
export class FileUploadComponent {
  @Input() multiple = false;
  @Input() acceptedFormats: string[] = []; // ✅ Fix: Ensure this property exists
  @Input() maxSizeMB = 5; // ✅ Fix: Ensure this property exists
  @Output() filesSelected = new EventEmitter<File[]>(); // ✅ Fix: Ensure this exists

  selectedFiles: File[] = [];
  isDragging = false;

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.processFiles(Array.from(input.files));
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave() {
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files) {
      this.processFiles(Array.from(event.dataTransfer.files));
    }
  }

  processFiles(files: File[]) {
    const validFiles = files.filter((file) => this.validateFile(file));
    if (validFiles.length) {
      this.selectedFiles = this.multiple
        ? [...this.selectedFiles, ...validFiles]
        : [validFiles[0]];
      this.filesSelected.emit(this.selectedFiles);
    }
  }

  validateFile(file: File): boolean {
    // ✅ Fix: Ensure this method exists
    const isValidType =
      this.acceptedFormats.length === 0 ||
      this.acceptedFormats.includes(
        `.${file.name.split('.').pop()?.toLowerCase()}`
      );
    const isValidSize = file.size <= this.maxSizeMB * 1024 * 1024;
    return isValidType && isValidSize;
  }

  uploadFiles() {
    if (this.selectedFiles.length === 0) {
      console.log('No files selected for upload.');
      return;
    }

    const fileData = this.selectedFiles.map((file) => ({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: file.type,
    }));

    console.log(
      'Uploaded Files:',
      JSON.stringify(
        {
          totalFiles: this.selectedFiles.length,
          files: fileData,
        },
        null,
        2
      )
    );
  }
}
