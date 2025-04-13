import { Meta, StoryObj } from '@storybook/angular';
import { DataTableComponent, PeriodicElement } from './data-table.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';

export default {
  title: 'Components/DataTable',
  component: DataTableComponent,
  decorators: [
    (story) => ({
      moduleMetadata: {
        imports: [CommonModule, FormsModule],
      },
      template: `<div style="padding: 3rem">${story()}</div>`,
    }),
  ],
  parameters: {
    layout: 'padded',
  },
} as Meta<DataTableComponent>;

type Story = StoryObj<DataTableComponent>;

const sampleData: PeriodicElement[] = [
  { no: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { no: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { no: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { no: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { no: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
];

export const Default: Story = {
  args: {
    data: sampleData,
    columns: [
      { key: 'no', label: 'No.', sticky: true },
      { key: 'name', label: 'Name', sticky: true },
      { key: 'weight', label: 'Weight' },
      { key: 'symbol', label: 'Symbol' },
    ],
    showFilter: true,
    showPagination: true,
    enableSelection: true,
    expandable: true,
    itemsPerPage: 5,
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement as HTMLElement;
    const element = canvas.querySelector('lib-data-table');
    if (element) {
      const component = element as unknown as DataTableComponent;
      component.cdr.detectChanges();
    }
  },
};

// Optional: Test with Default change detection
export const DefaultNoOnPush: Story = {
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (story) => ({
      moduleMetadata: {
        imports: [CommonModule, FormsModule],
        declarations: [
          class {
            constructor() {
              Object.defineProperty(this, 'changeDetection', {
                get: () => ChangeDetectionStrategy.Default,
              });
            }
            template = `<lib-data-table [data]="data" [columns]="columns" [showFilter]="showFilter" [showPagination]="showPagination" [enableSelection]="enableSelection" [expandable]="expandable" [itemsPerPage]="itemsPerPage"></lib-data-table>`;
          },
        ],
      },
      props: {
        data: sampleData,
        columns: [
          { key: 'no', label: 'No.', sticky: true },
          { key: 'name', label: 'Name', sticky: true },
          { key: 'weight', label: 'Weight' },
          { key: 'symbol', label: 'Symbol' },
        ],
        showFilter: true,
        showPagination: true,
        enableSelection: true,
        expandable: true,
        itemsPerPage: 5,
      },
    }),
  ],
};
