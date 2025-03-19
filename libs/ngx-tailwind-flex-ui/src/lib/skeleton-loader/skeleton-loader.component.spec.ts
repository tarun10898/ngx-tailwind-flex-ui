import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonLoaderComponent } from './skeleton-loader.component';
import { CommonModule } from '@angular/common';

describe('SkeletonLoaderComponent', () => {
  let component: SkeletonLoaderComponent;
  let fixture: ComponentFixture<SkeletonLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonLoaderComponent, CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Type Tests
  it('should apply correct type class for text loader', () => {
    component.type = 'text';
    fixture.detectChanges();
    const loaderElement =
      fixture.nativeElement.querySelector('.skeleton-loader');
    expect(loaderElement.classList).toContain('rounded');
  });

  it('should apply correct type class for circle loader', () => {
    component.type = 'circle';
    fixture.detectChanges();
    const loaderElement =
      fixture.nativeElement.querySelector('.skeleton-loader');
    expect(loaderElement.classList).toContain('rounded-full');
  });

  it('should apply correct type class for rect loader', () => {
    component.type = 'rect';
    fixture.detectChanges();
    const loaderElement =
      fixture.nativeElement.querySelector('.skeleton-loader');
    expect(loaderElement.classList).toContain('rounded-lg');
  });

  it('should default to rect type if invalid type is provided', () => {
    component.type = 'invalid' as 'text' | 'circle' | 'rect';
    fixture.detectChanges();
    const loaderElement =
      fixture.nativeElement.querySelector('.skeleton-loader');
    expect(loaderElement.classList).toContain('rounded-lg');
  });

  it('should default to rect type if type is undefined', () => {
    component.type = undefined;
    fixture.detectChanges();
    const loaderElement =
      fixture.nativeElement.querySelector('.skeleton-loader');
    expect(loaderElement.classList).toContain('rounded-lg');
  });

  // Animation Tests
  it('should apply pulse animation by default', () => {
    fixture.detectChanges();
    const loaderElement =
      fixture.nativeElement.querySelector('.skeleton-loader');
    expect(loaderElement.classList).toContain('animate-pulse');
  });

  it('should apply wave animation when specified', () => {
    component.animation = 'wave';
    fixture.detectChanges();
    const loaderElement =
      fixture.nativeElement.querySelector('.skeleton-loader');
    expect(loaderElement.classList).toContain('animate-wave');
  });

  it('should apply shimmer animation when specified', () => {
    component.animation = 'shimmer';
    fixture.detectChanges();
    const loaderElement =
      fixture.nativeElement.querySelector('.skeleton-loader');
    expect(loaderElement.classList).toContain('animate-shimmer');
  });

  it('should apply fade animation when specified', () => {
    component.animation = 'fade';
    fixture.detectChanges();
    const loaderElement =
      fixture.nativeElement.querySelector('.skeleton-loader');
    expect(loaderElement.classList).toContain('animate-fade');
  });

  it('should apply bounce animation when specified', () => {
    component.animation = 'bounce';
    fixture.detectChanges();
    const loaderElement =
      fixture.nativeElement.querySelector('.skeleton-loader');
    expect(loaderElement.classList).toContain('animate-bounce');
  });

  it('should apply no animation when specified', () => {
    component.animation = 'none';
    fixture.detectChanges();
    const loaderElement =
      fixture.nativeElement.querySelector('.skeleton-loader');
    expect(loaderElement.classList).not.toContain('animate-pulse');
    expect(loaderElement.classList).not.toContain('animate-wave');
    expect(loaderElement.classList).not.toContain('animate-shimmer');
    expect(loaderElement.classList).not.toContain('animate-fade');
    expect(loaderElement.classList).not.toContain('animate-bounce');
  });

  it('should default to pulse animation if invalid animation is provided', () => {
    component.animation = 'invalid' as
      | 'pulse'
      | 'wave'
      | 'shimmer'
      | 'fade'
      | 'bounce'
      | 'none';
    fixture.detectChanges();
    const loaderElement =
      fixture.nativeElement.querySelector('.skeleton-loader');
    expect(loaderElement.classList).toContain('animate-pulse');
  });

  it('should default to pulse animation if animation is undefined', () => {
    component.animation = undefined;
    fixture.detectChanges();
    const loaderElement =
      fixture.nativeElement.querySelector('.skeleton-loader');
    expect(loaderElement.classList).toContain('animate-pulse');
  });

  // Dimension Tests
  it('should apply correct dimensions for circle loader', () => {
    component.type = 'circle';
    component.size = '50px';
    fixture.detectChanges();
    const loaderElement =
      fixture.nativeElement.querySelector('.skeleton-loader');
    expect(loaderElement.style.width).toBe('50px');
    expect(loaderElement.style.height).toBe('50px');
  });

  it('should apply correct dimensions for rect loader', () => {
    component.type = 'rect';
    component.width = '200px';
    component.height = '100px';
    fixture.detectChanges();
    const loaderElement =
      fixture.nativeElement.querySelector('.skeleton-loader');
    expect(loaderElement.style.width).toBe('200px');
    expect(loaderElement.style.height).toBe('100px');
  });

  it('should apply default height for text loader', () => {
    component.type = 'text';
    component.width = '100%';
    fixture.detectChanges();
    const loaderElement =
      fixture.nativeElement.querySelector('.skeleton-loader');
    expect(loaderElement.style.height).toBe('16px');
  });

  it('should fall back to default dimensions when invalid values are provided', () => {
    component.type = 'rect';
    component.width = 'invalid';
    component.height = 'invalid';
    fixture.detectChanges();
    const loaderElement =
      fixture.nativeElement.querySelector('.skeleton-loader');
    expect(loaderElement.style.width).toBe('100%');
    expect(loaderElement.style.height).toBe('16px');
  });

  // Color Tests
  it('should apply default gray color when no color is provided', () => {
    component.color = undefined;
    fixture.detectChanges();
    const loaderElement =
      fixture.nativeElement.querySelector('.skeleton-loader');
    expect(loaderElement.classList).toContain('bg-gray-200');
  });

  it('should apply custom color when valid Tailwind class is provided via input', () => {
    component.color = 'bg-blue-300';
    fixture.detectChanges();
    const loaderElement =
      fixture.nativeElement.querySelector('.skeleton-loader');
    expect(loaderElement.classList).toContain('bg-blue-300');
  });

  it('should apply default color if invalid color is provided via input', () => {
    component.color = 'invalid-color';
    fixture.detectChanges();
    const loaderElement =
      fixture.nativeElement.querySelector('.skeleton-loader');
    expect(loaderElement.classList).toContain('bg-gray-200');
  });
});
