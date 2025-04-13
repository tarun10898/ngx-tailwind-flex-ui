import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PeriodicElement {
  no: number;
  name: string;
  weight: number;
  symbol: string;
  [key: string]: number | string;
}

export interface Column {
  key: string;
  label: string;
  sticky?: boolean;
  sortable?: boolean;
}

@Component({
  selector: 'lib-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent implements OnInit {
  @Input() set data(value: PeriodicElement[] | Observable<PeriodicElement[]>) {
    if (value instanceof Observable) {
      this.isObservableData = true;
      this.dataSource$ = value;
      this.dataSource$.subscribe((data) => {
        this._data = data || [];
        this.updateFilteredData();
      });
    } else {
      this.isObservableData = false;
      this._data = value || [];
      this.updateFilteredData();
    }
  }

  @Input() set columns(value: (string | Column)[]) {
    if (value && value.length) {
      this._columns = value.map((col) => {
        if (typeof col === 'string') {
          return { key: col, label: this.formatColumnLabel(col) };
        }
        return { ...col, label: col.label || this.formatColumnLabel(col.key) };
      });
    } else {
      this._columns = [
        { key: 'no', label: 'No.', sticky: true },
        { key: 'name', label: 'Name', sticky: true },
        { key: 'weight', label: 'Weight' },
        { key: 'symbol', label: 'Symbol' },
      ];
    }
    this.updateFilteredData();
  }

  get columns(): Column[] {
    return this._columns;
  }

  @Input() expandable = false;
  @Input() itemsPerPage = 5;
  @Input() showPagination = true;
  @Input() showFilter = true;
  @Input() enableSelection = false;
  @Output() selectionChange = new EventEmitter<PeriodicElement[]>();
  @Output() dataChange = new EventEmitter<PeriodicElement[]>();

  _data: PeriodicElement[] = [];
  _columns: Column[] = [];
  private dataSubject = new BehaviorSubject<PeriodicElement[]>([]);

  dataSource$: Observable<PeriodicElement[]> = this.dataSubject.asObservable();
  filteredData: PeriodicElement[] = [];
  displayData: PeriodicElement[] = [];
  isObservableData = false;
  selectedRows: Set<number> = new Set();
  expandedRows: Set<number> = new Set();

  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  totalPages = 1;
  filterText = '';

  public cdr: ChangeDetectorRef;

  constructor(cdr: ChangeDetectorRef) {
    this.cdr = cdr;
  }

  ngOnInit(): void {
    if (!this._data.length && !this.isObservableData) {
      this._data = [
        { no: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
        { no: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
        { no: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
        { no: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
        { no: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
      ];
      this.updateFilteredData();
    }
  }

  addColumn(key: string, label?: string): void {
    if (!this.columns.some((col) => col.key === key)) {
      this._columns.push({
        key,
        label: label || this.formatColumnLabel(key),
      });
      this.updateFilteredData();
      this.cdr.markForCheck();
    }
  }

  removeColumn(key: string): void {
    const index = this._columns.findIndex((col) => col.key === key);
    if (index !== -1) {
      this._columns.splice(index, 1);
      this.updateFilteredData();
      this.cdr.markForCheck();
    }
  }

  shuffleColumns(): void {
    const stickyColumns = this._columns.filter((col) => col.sticky);
    const nonStickyColumns = this._columns.filter((col) => !col.sticky);

    for (let i = nonStickyColumns.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nonStickyColumns[i], nonStickyColumns[j]] = [
        nonStickyColumns[j],
        nonStickyColumns[i],
      ];
    }

    this._columns = [...stickyColumns, ...nonStickyColumns];
    this.updateFilteredData();
    this.cdr.markForCheck();
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.updateFilteredData();
  }

  filter(): void {
    this.currentPage = 1;
    this.updateFilteredData();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updateDisplayData();
  }

  toggleRowSelection(index: number): void {
    const elementNo = this.filteredData[index].no;
    if (this.selectedRows.has(elementNo)) {
      this.selectedRows.delete(elementNo);
    } else {
      this.selectedRows.add(elementNo);
    }
    const selectedElements = this._data.filter((item) =>
      this.selectedRows.has(item.no)
    );
    this.selectionChange.emit(selectedElements);
    this.cdr.markForCheck();
  }

  isSelected(element: PeriodicElement): boolean {
    return this.selectedRows.has(element.no);
  }

  toggleAllSelection(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.filteredData.forEach((item) => this.selectedRows.add(item.no));
    } else {
      this.selectedRows.clear();
    }
    const selectedElements = this._data.filter((item) =>
      this.selectedRows.has(item.no)
    );
    this.selectionChange.emit(selectedElements);
    this.cdr.markForCheck();
  }

  toggleRowExpansion(index: number): void {
    const elementNo = this.displayData[index].no;
    if (this.expandedRows.has(elementNo)) {
      this.expandedRows.delete(elementNo);
    } else {
      this.expandedRows.add(elementNo);
    }
    this.cdr.markForCheck();
  }

  isExpanded(element: PeriodicElement): boolean {
    return this.expandedRows.has(element.no);
  }

  addData(element: PeriodicElement): void {
    if (this.isObservableData) {
      this._data = [...this._data, element];
      this.dataChange.emit(this._data);
    } else {
      this._data = [...this._data, element];
      this.updateFilteredData();
    }
  }

  removeData(element: PeriodicElement): void {
    if (this.isObservableData) {
      this._data = this._data.filter((item) => item.no !== element.no);
      this.dataChange.emit(this._data);
    } else {
      this._data = this._data.filter((item) => item.no !== element.no);
      this.updateFilteredData();
    }
  }

  updateFilteredData(): void {
    let filteredData = [...this._data];

    if (this.filterText) {
      const filterTextLower = this.filterText.toLowerCase();
      filteredData = filteredData.filter((item) =>
        Object.values(item).some(
          (value) =>
            value !== null &&
            value !== undefined &&
            String(value).toLowerCase().includes(filterTextLower)
        )
      );
    }

    if (this.sortColumn) {
      filteredData.sort((a, b) => {
        const valueA = a[this.sortColumn as string];
        const valueB = b[this.sortColumn as string];
        if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.filteredData = filteredData;
    this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages)
      this.currentPage = this.totalPages || 1;
    this.updateDisplayData();
  }

  private updateDisplayData(): void {
    if (this.showPagination) {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.displayData = this.filteredData.slice(
        startIndex,
        startIndex + this.itemsPerPage
      );
    } else {
      this.displayData = this.filteredData;
    }
    this.cdr.markForCheck();
  }

  private formatColumnLabel(key: string): string {
    return key.charAt(0).toUpperCase() + key.slice(1);
  }
}
