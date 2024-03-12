import {
  Component,
  AfterViewInit,
  ViewChildren,
  QueryList,
  inject,
  ChangeDetectorRef,
} from '@angular/core';

import {
  DragDropModule,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DragDropModule, CommonModule],
  template: `
    <table>
      <!-- //NOSONAR -->
      <tr class="list">
        @for (list of tableData; track $index) {
        <td
          cdkDropList
          #day="cdkDropList"
          [cdkDropListData]="list"
          [cdkDropListConnectedTo]="days"
          (cdkDropListDropped)="drop($event)"
        >
          @for (item of list; track $index) {
          <div class="box" cdkDrag [cdkDragData]="item">
            <div
              cdkDropList
              [id]="item.id + ''"
              #booking="cdkDropList"
              [cdkDropListData]="item.inner"
              [cdkDropListConnectedTo]="connectedTo"
              (cdkDropListDropped)="childDrop($event)"
            >
              @for (field of item.inner; track $index) {
              <div cdkDrag [cdkDragData]="field" [id]="field.id + ''">
                {{ field.id }}
              </div>
              }
            </div>
          </div>
          }
        </td>
        }
      </tr>
    </table>
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  title = 'drag-n-drop';
  @ViewChildren('day') cdkDropDays: QueryList<CdkDropList>;
  @ViewChildren('booking') cdkDropBookings: QueryList<CdkDropList>;
  days: CdkDropList[] = [];
  connectedTo: any = [];

  cdk = inject(ChangeDetectorRef);

  tableData = [
    [
      { id: 1, data: 'test1', inner: [{ id: '1-1', data: 'test1-inner' }] },
      {
        id: 2,
        data: 'test1',
        inner: [
          { id: '2-2', data: 'test2-inner-1' },
          { id: '2-1', data: 'test2-inner-2' },
        ],
      },
    ],
    [{ id: 3, data: 'test1', inner: [{ id: '3-1', data: 'test3-inner' }] }],
    [
      { id: 4, data: 'test1', inner: [{ id: '4-1', data: 'test4-inner' }] },
      {
        id: 5,
        data: 'test1',
        inner: [
          { id: '5-1', data: 'test5-inner-1' },
          { id: '5-2', data: 'test5-inner-2' },
        ],
      },
    ],
    [
      { id: 6, data: 'test1', inner: [{ id: '6-1', data: 'test6-inner' }] },
      { id: 7, data: 'test1', inner: [{ id: '7-1', data: 'test7-inner' }] },
    ],
    [
      { id: 8, data: 'test1', inner: [{ id: '8-1', data: 'test8-inner' }] },
      { id: 9, data: 'test1', inner: [{ id: '9-1', data: 'test9-inner' }] },
    ],
  ];

  ngAfterViewInit() {
    this.days = this.cdkDropDays.toArray();
    this.connectedTo = this.tableData.reduce((prev: any, curr: any) => {
      return [...prev, ...curr.map((c: any) => c.id + '')];
    }, []);
    this.cdk.detectChanges();
  }

  drop(event: any) {
    console.log('Dropped', event.item.data.data);

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  childDrop(event: any) {
    if (event.previousContainer === event.container) return;

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
}
