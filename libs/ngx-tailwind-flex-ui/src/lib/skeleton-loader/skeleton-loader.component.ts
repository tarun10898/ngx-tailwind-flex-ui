import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.css'],
})
export class SkeletonLoaderComponent implements OnInit {
  @Input() type: 'text' | 'circle' | 'rect' | undefined = 'rect';
  @Input() width = '100%';
  @Input() height = '16px';
  @Input() size = '40px';
  @Input() animation:
    | 'pulse'
    | 'wave'
    | 'shimmer'
    | 'fade'
    | 'bounce'
    | 'none'
    | undefined = 'pulse';
  @Input() color: string | undefined;

  ngOnInit() {
    console.log('Initializing SkeletonLoader with inputs:', {
      type: this.type,
      width: this.width,
      height: this.height,
      size: this.size,
      animation: this.animation,
      color: this.color,
    });

    // Ensure all inputs are strings to avoid rendering issues
    this.width = typeof this.width === 'string' ? this.width : '100%';
    this.height = typeof this.height === 'string' ? this.height : '16px';
    this.size = typeof this.size === 'string' ? this.size : '40px';
    this.color = typeof this.color === 'string' ? this.color : undefined;
  }

  get validatedColor(): string {
    if (this.color && typeof this.color === 'string') {
      const colorClasses = this.color.trim().split(/\s+/);
      const isValid = colorClasses.every(
        (cls) =>
          cls.startsWith('bg-') ||
          cls.startsWith('from-') ||
          cls.startsWith('to-') ||
          cls.startsWith('via-')
      );
      return isValid ? this.color : 'bg-gray-200';
    }
    return 'bg-gray-200';
  }

  get validatedTypeClass(): string {
    switch (this.type) {
      case 'text':
        return 'rounded';
      case 'circle':
        return 'rounded-full';
      case 'rect':
        return 'rounded-lg';
      default:
        return 'rounded-lg';
    }
  }

  get validatedAnimationClass(): string {
    switch (this.animation) {
      case 'pulse':
      case 'wave':
      case 'shimmer':
      case 'fade':
      case 'bounce':
        return `animate-${this.animation}`;
      case 'none':
        return '';
      default:
        return 'animate-pulse';
    }
  }
}
