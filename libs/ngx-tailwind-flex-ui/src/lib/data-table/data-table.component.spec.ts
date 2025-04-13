import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

import { DataTableComponent, PeriodicElement } from './data-table.component';

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;
  const sampleData: PeriodicElement[] = [
    { no: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { no: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { no: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, DataTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    // Initialize columns explicitly to match sampleData
    component.columns = [
      { key: 'no', label: 'No' },
      { key: 'name', label: 'Name' },
      { key: 'weight', label: 'Weight' },
      { key: 'symbol', label: 'Symbol' },
    ];
    component.data = [...sampleData];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render table with correct initial data', () => {
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(3); // Three rows of sample data

    const firstRowCells = rows[0].queryAll(By.css('td'));
    expect(firstRowCells.length).toBe(4); // Four columns: no, name, weight, symbol
    expect(firstRowCells[0].nativeElement.textContent.trim()).toBe('1'); // no
    expect(firstRowCells[1].nativeElement.textContent.trim()).toBe('Hydrogen'); // name
  });

  it('should add a column', () => {
    const initialColumnCount = component.columns.length;
    component.addColumn('test', 'Test Column');
    fixture.detectChanges();

    expect(component.columns.length).toBe(initialColumnCount + 1);
    expect(component.columns[initialColumnCount].key).toBe('test');
    expect(component.columns[initialColumnCount].label).toBe('Test Column');

    const headerCells = fixture.debugElement.queryAll(By.css('thead th'));
    expect(headerCells.length).toBe(component.columns.length);
  });

  it('should remove a column', () => {
    const initialColumnCount = component.columns.length;
    component.removeColumn('weight');
    fixture.detectChanges();

    expect(component.columns.length).toBe(initialColumnCount - 1);
    expect(
      component.columns.find((col) => col.key === 'weight')
    ).toBeUndefined();

    const headerCells = fixture.debugElement.queryAll(By.css('thead th'));
    expect(headerCells.length).toBe(component.columns.length);
  });

  it('should filter data correctly', () => {
    component.filterText = 'He';
    component.filter();
    fixture.detectChanges();

    expect(component.filteredData.length).toBe(1);
    expect(component.filteredData[0].name).toBe('Helium');

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(1);
  });

  it('should sort data correctly', () => {
    component.sort('name');
    fixture.detectChanges();

    expect(component.sortColumn).toBe('name');
    expect(component.sortDirection).toBe('asc');
    expect(component.filteredData[0].name).toBe('Helium');

    component.sort('name'); // second click should reverse order
    fixture.detectChanges();

    expect(component.sortDirection).toBe('desc');
    expect(component.filteredData[0].name).toBe('Lithium');
  });

  it('should handle selection correctly when enabled', () => {
    component.enableSelection = true;
    fixture.detectChanges();

    const spy = jest.spyOn(component.selectionChange, 'emit');
    const firstRow = fixture.debugElement.query(By.css('tbody tr'));
    const checkbox = firstRow.query(By.css('input[type="checkbox"]'));

    if (checkbox) {
      checkbox.triggerEventHandler('change', { target: { checked: true } });
      expect(component.selectedRows.size).toBe(1);
      expect(component.selectedRows.has(1)).toBe(true);
      expect(spy).toHaveBeenCalled();
    } else {
      fail('Checkbox not found in row');
    }
  });

  it('should work with observable data source', () => {
    const dataSubject = new BehaviorSubject<PeriodicElement[]>(sampleData);
    component.data = dataSubject;
    fixture.detectChanges();

    expect(component.filteredData.length).toBe(3);

    // Update observable with new data
    const newData = [
      ...sampleData,
      { no: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    ];
    dataSubject.next(newData);
    fixture.detectChanges();

    expect(component.filteredData.length).toBe(4);

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(4);
  });

  it('should add data to array-based data source', () => {
    const initialLength = component.filteredData.length;
    const newElement = {
      no: 4,
      name: 'Beryllium',
      weight: 9.0122,
      symbol: 'Be',
    };

    component.addData(newElement);
    fixture.detectChanges();

    expect(component.filteredData.length).toBe(initialLength + 1);
    expect(component.filteredData[initialLength].name).toBe('Beryllium');

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(initialLength + 1);
  });

  it('should remove data from array-based data source', () => {
    const initialLength = component.filteredData.length;
    const elementToRemove = component._data[0];

    component.removeData(elementToRemove);
    fixture.detectChanges();

    expect(component.filteredData.length).toBe(initialLength - 1);
    expect(
      component.filteredData.find((el) => el.no === elementToRemove.no)
    ).toBeUndefined();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(initialLength - 1);
  });

  it('should handle pagination correctly', () => {
    component.itemsPerPage = 2;
    component._data = [
      ...sampleData,
      { no: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
      { no: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    ];
    component.updateFilteredData();
    fixture.detectChanges();

    expect(component.totalPages).toBe(3);
    expect(component.displayData.length).toBe(2);

    component.changePage(2);
    fixture.detectChanges();

    expect(component.currentPage).toBe(2);
    expect(component.displayData.length).toBe(2);
    expect(component.displayData[0].no).toBe(3);
  });
});
