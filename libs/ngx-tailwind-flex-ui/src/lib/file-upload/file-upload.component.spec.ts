import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileUploadComponent } from './file-upload.component';
import { CommonModule } from '@angular/common';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadComponent, CommonModule], // ✅ Fix: Import component instead of declaring
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    component.selectedFiles = []; // ✅ FIX: Initialize before running tests
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept valid file types', () => {
    component.acceptedFormats = ['.jpg', '.png'];
    const validFile = new File(['dummy content'], 'image.jpg', {
      type: 'image/jpeg',
    });
    expect(component.validateFile(validFile)).toBeTruthy();
  });

  it('should reject invalid file types', () => {
    component.acceptedFormats = ['.jpg', '.png'];
    const invalidFile = new File(['dummy content'], 'document.pdf', {
      type: 'application/pdf',
    });
    expect(component.validateFile(invalidFile)).toBeFalsy();
  });

  it('should enforce file size limits', () => {
    component.maxSizeMB = 2;

    const validFile = new File(['dummy content'], 'image.jpg', {
      type: 'image/jpeg',
    });
    Object.defineProperty(validFile, 'size', { value: 1 * 1024 * 1024 });

    const largeFile = new File(['dummy content'], 'large.jpg', {
      type: 'image/jpeg',
    });
    Object.defineProperty(largeFile, 'size', { value: 3 * 1024 * 1024 });

    expect(component.validateFile(validFile)).toBeTruthy();
    expect(component.validateFile(largeFile)).toBeFalsy();
  });

  it('should emit selected files', () => {
    const emitSpy = jest.spyOn(component.filesSelected, 'emit'); // ✅ FIX: Use `jest.spyOn()`

    const validFile = new File(['dummy content'], 'image.jpg', {
      type: 'image/jpeg',
    });
    Object.defineProperty(validFile, 'size', { value: 1 * 1024 * 1024 });

    component.processFiles([validFile]);

    expect(emitSpy).toHaveBeenCalledWith([validFile]);
  });

  it('should display selected files in the template', () => {
    const validFile = new File(['dummy content'], 'image.jpg', {
      type: 'image/jpeg',
    });

    component.selectedFiles = [validFile];
    fixture.detectChanges();

    const fileListItem =
      fixture.debugElement.nativeElement.querySelector('ul li');
    expect(fileListItem.textContent).toContain('image.jpg');
  });
});
