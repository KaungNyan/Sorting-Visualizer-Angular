import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

declare var $:any;

@Component({
  selector: 'app-sorting-visualizer',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sorting-visualizer.component.html',
  styleUrl: './sorting-visualizer.component.css'
})
export class SortingVisualizerComponent implements OnInit {
  disable: boolean = false;
  arraySize: number = 5;
  timeout: number = 30;
  arr: number[] = [];       //  real array - bind to UI
  tempArr: number[] = [];   //  temp array for visual
  color = {
    ok: "green",
    change: "red",
    current: "yellow",
    pivot: "orange",
    normal: "black"
  };

  msWaitTime: number = 0;
  qsWaitTime: number = 0;

  ngOnInit(): void {
    this.generateArray();
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  generateArray() {
    this.arr = [];
    this.tempArr = [];
    let ranNum = 0;

    for(let i = 0; i < this.arraySize; i++) {
      ranNum = this.generateRandomNumber(1, 1000);
      this.arr.push(ranNum);
      this.tempArr.push(ranNum);
    }

    this.changeDetectorRef.detectChanges();
    this.paintAllArray();
  }

  paintAllArray() {
    for(let i = 0; i < this.arraySize; i++) {
      this.styleUpdate(0, "#" + i, this.arr[i], this.color.normal);
    }
  }

  generateRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  start(name: string) {
    this.disable = true;

    if(name == "bubble") {
      this.bubbleSort();
    } else if(name == "merge") {
      this.mergeSort(0, this.arraySize - 1);
      this.allCorrectAnimation(this.msWaitTime);
      this.qsWaitTime = 0;
      this.disable = false;
    } else if(name == "insertion") {
      this.insertionSort();
    } else if(name == "selection") {
      this.selectionSort();
    } else if(name == "quick") {
      this.quickSort(0, this.arraySize - 1);
      this.allCorrectAnimation(this.qsWaitTime);
      this.qsWaitTime = 0;
    }
  }

  // compares adjacent indexes and moves largest to last
  bubbleSort() {
    let swapped: boolean = false;
    let temp: number = 0;
    let waitTime: number = 0;

    for(let i = 0; i < this.arraySize - 1; i++) {
      swapped = false;

      for(let j = 0; j < this.arraySize - i - 1; j++) {
        this.styleUpdate(waitTime, "#" + j, this.tempArr[j], this.color.current);
        this.styleUpdate(waitTime, "#" + (j + 1), this.tempArr[j + 1], this.color.current);
        waitTime += this.timeout;

        if(this.tempArr[j] > this.tempArr[j + 1]) {
          this.styleUpdate(waitTime, "#" + j, this.tempArr[j], this.color.change);
          this.styleUpdate(waitTime, "#" + (j + 1), this.tempArr[j + 1], this.color.change);
          waitTime += this.timeout;

          temp = this.tempArr[j];
          this.tempArr[j] = this.tempArr[j + 1];
          this.tempArr[j + 1] = temp;
          swapped = true;
        }

        this.styleUpdate(waitTime, "#" + j, this.tempArr[j], this.color.ok);
        this.styleUpdate(waitTime, "#" + (j + 1), this.tempArr[j + 1], this.color.ok);
        waitTime += this.timeout;

        this.styleUpdate(waitTime, "#" + j, this.tempArr[j], this.color.normal);
        this.styleUpdate(waitTime, "#" + (j + 1), this.tempArr[j + 1], this.color.normal);
        waitTime += this.timeout;
      }

      if(!swapped) break;
    }

    this.allCorrectAnimation(waitTime);
  }

  mergeSort(left: number, right: number) {
    if(left < right) {
      let mid = Math.floor(left + ((right - left) / 2));
      this.mergeSort(left, mid);
      this.mergeSort(mid + 1, right);
      this.merge(left, mid, right);
    }
  }

  merge(left: number, mid: number,right: number) {
    let i, j;
    const leftLength = mid - left + 1;
    const rightLength = right - mid;
    const leftArr = new Array(leftLength);
    const rightArr = new Array(rightLength);

    for(i = 0; i < leftLength; i++) {
      leftArr[i] = this.tempArr[left + i];
    }

    for(j = 0; j < leftLength; j++) {
      rightArr[j] = this.tempArr[mid + 1 + j];
    }

    i = 0;
    j = 0;
    let k = left;

    while(i < leftLength && j < rightLength) {
      this.styleUpdate(this.msWaitTime, "#" + (i + left), this.tempArr[i + left], this.color.current);
      this.styleUpdate(this.msWaitTime, "#" + (j + left), this.tempArr[j + left], this.color.current);
      this.msWaitTime += this.timeout;

      if(leftArr[i] < rightArr[j]) {
        this.tempArr[k] = leftArr[i];

        this.styleUpdate(this.msWaitTime, "#" + (i + left), this.tempArr[i + left], this.color.change);
        this.msWaitTime += this.timeout;
        this.styleUpdate(this.msWaitTime, "#" + (i + left), this.tempArr[i + left], this.color.ok);
        this.msWaitTime += this.timeout;
        this.styleUpdate(this.msWaitTime, "#" + (i + left), this.tempArr[i + left], this.color.normal);
        this.msWaitTime += this.timeout;

        i++;
      } else {
        this.tempArr[k] = rightArr[j];

        this.styleUpdate(this.msWaitTime, "#" + (j + left), this.tempArr[j + left], this.color.change);
        this.msWaitTime += this.timeout;
        this.styleUpdate(this.msWaitTime, "#" + (j + left), this.tempArr[j + left], this.color.ok);
        this.msWaitTime += this.timeout;
        this.styleUpdate(this.msWaitTime, "#" + (j + left), this.tempArr[j + left], this.color.normal);
        this.msWaitTime += this.timeout;

        j++;
      }

      k++;
    }

    while(i < leftLength) {
      this.tempArr[k] = leftArr[i];

      this.styleUpdate(this.msWaitTime, "#" + (i + left), this.tempArr[i + left], this.color.change);
      this.msWaitTime += this.timeout;
      this.styleUpdate(this.msWaitTime, "#" + (i + left), this.tempArr[i + left], this.color.ok);
      this.msWaitTime += this.timeout;
      this.styleUpdate(this.msWaitTime, "#" + (i + left), this.tempArr[i + left], this.color.normal);
      this.msWaitTime += this.timeout;

      i++;
      k++;
    }

    while(j < rightLength) {
      this.tempArr[k] = rightArr[j];

      this.styleUpdate(this.msWaitTime, "#" + (j + left), this.tempArr[j + left], this.color.change);
      this.msWaitTime += this.timeout;
      this.styleUpdate(this.msWaitTime, "#" + (j + left), this.tempArr[j + left], this.color.ok);
      this.msWaitTime += this.timeout;
      this.styleUpdate(this.msWaitTime, "#" + (j + left), this.tempArr[j + left], this.color.normal);
      this.msWaitTime += this.timeout;

      j++;
      k++;
    }
  }

  // compares pivot with lower indexes  => larger(lower_index > pivot) - move to +1 index
  //                                    => smaller(lower_index < pivot) - break loop and changes +1 index to pivot
  insertionSort() {
    let key = 0;
    let j = 0;
    let temp = 0;
    let waitTime = 0;

    for(let i = 1; i < this.arraySize; i++) {
      key = this.tempArr[i];
      j = i - 1;

      /* real
      while(j >= 0 && this.arr[j] > key) {
        this.arr[j + 1] = this.arr[j];
        j--;
      }

      this.arr[j + 1] = key;
      */

      // for visual reason
      while(j >= 0) {
        this.styleUpdate(waitTime, "#" + (j + 1), this.tempArr[j + 1], this.color.pivot);
        
        if(this.tempArr[j] > key) {
          waitTime += this.timeout;
          this.styleUpdate(waitTime, "#" + j, this.tempArr[j], this.color.current);
          waitTime += this.timeout;
          this.styleUpdate(waitTime, "#" + j, this.tempArr[j], this.color.change);
          waitTime += this.timeout;
  
          this.tempArr[j + 1] = this.tempArr[j];
          this.tempArr[j] = key;
  
          this.styleUpdate(waitTime, "#" + j, key, this.color.ok);
          this.styleUpdate(waitTime, "#" + (j + 1), this.tempArr[j + 1], this.color.ok);
          waitTime += this.timeout;
          this.styleUpdate(waitTime, "#" + (j + 1), this.tempArr[j + 1], this.color.normal);
  
          j--;
        } else {
          this.styleUpdate(waitTime, "#" + j, this.tempArr[j], this.color.current);
          waitTime += this.timeout;
          this.styleUpdate(waitTime, "#" + j, this.tempArr[j], this.color.ok);
          waitTime += this.timeout;
          this.styleUpdate(waitTime, "#" + j, this.tempArr[j], this.color.normal);
          break;
        }
      }
      
      this.styleUpdate(waitTime, "#" + (j + 1), this.tempArr[j + 1], this.color.normal);
      waitTime += this.timeout;
    }

    this.allCorrectAnimation(waitTime);
  }

  // uses last index as pivot and marks lowest index
  // compares with lower indexes  => smaller(lower_index < pivot) - change current index with lowest index and add 1 to lowest index
  //                              => larger(lower_index > pivot) - do nothing
  // after comparing, changes lowest index with pivot and return lowest index to determine next pivot
  quickSort(low: number, high: number) {
    if(low < high) {
      let pivot = this.quickSortPartition(low, high);

      this.quickSort(low, pivot - 1);
      this.quickSort(pivot + 1, high);
    }
  }

  quickSortPartition(low: number, high: number) {
    let pivot = this.tempArr[high];
    let i = low;

    this.styleUpdate(this.qsWaitTime, "#" + high, this.tempArr[high], this.color.pivot);

    for(let j = low; j < high; j++) {
      this.styleUpdate(this.qsWaitTime, "#" + i, this.tempArr[i], this.color.pivot);
      this.qsWaitTime += this.timeout;
      this.styleUpdate(this.qsWaitTime, "#" + j, this.tempArr[j], this.color.current);
      this.qsWaitTime += this.timeout;

      if(this.tempArr[j] < pivot) {
        this.styleUpdate(this.qsWaitTime, "#" + j, this.tempArr[j], this.color.change);
        this.qsWaitTime += this.timeout;

        [this.tempArr[i], this.tempArr[j]] = [this.tempArr[j], this.tempArr[i]];

        this.styleUpdate(this.qsWaitTime, "#" + i, this.tempArr[i], this.color.ok);
        this.styleUpdate(this.qsWaitTime, "#" + j, this.tempArr[j], this.color.ok);
        this.qsWaitTime += this.timeout;
        this.styleUpdate(this.qsWaitTime, "#" + i, this.tempArr[i], this.color.normal);
        this.styleUpdate(this.qsWaitTime, "#" + j, this.tempArr[j], this.color.normal);
        this.qsWaitTime += this.timeout;

        i++;
      } else {
        this.styleUpdate(this.qsWaitTime, "#" + j, this.tempArr[j], this.color.ok);
        this.qsWaitTime += this.timeout;
        this.styleUpdate(this.qsWaitTime, "#" + j, this.tempArr[j], this.color.normal);
        this.qsWaitTime += this.timeout;
      }
    }

    [this.tempArr[i], this.tempArr[high]] = [this.tempArr[high], this.tempArr[i]];
    this.styleUpdate(this.qsWaitTime, "#" + i, this.tempArr[i], this.color.ok);
    this.styleUpdate(this.qsWaitTime, "#" + high, this.tempArr[high], this.color.ok);
    this.qsWaitTime += this.timeout;
    this.styleUpdate(this.qsWaitTime, "#" + i, this.tempArr[i], this.color.normal);
    this.styleUpdate(this.qsWaitTime, "#" + high, this.tempArr[high], this.color.normal);
    this.qsWaitTime += this.timeout;

    return i;
  }

  // find minimum index and changes it with first
  selectionSort() {
    let minIndex = 0;
    let temp = 0;
    let waitTime = 0;

    for(let i = 0; i < this.arraySize - 1; i++) {
      minIndex = i;

      this.styleUpdate(waitTime, "#" + minIndex, this.tempArr[minIndex], this.color.pivot);
      waitTime += this.timeout;

      for(let j = i + 1; j < this.arraySize; j++) {
        this.styleUpdate(waitTime, "#" + j, this.tempArr[j], this.color.current);
        waitTime += this.timeout;

        if(this.tempArr[j] < this.tempArr[minIndex]) {
          this.styleUpdate(waitTime, "#" + j, this.tempArr[j], this.color.change);
          waitTime += this.timeout;
          if(i != minIndex) {
            this.styleUpdate(waitTime, "#" + minIndex, this.tempArr[minIndex], this.color.normal);
            waitTime += this.timeout;
          }

          minIndex = j;
        } else {
          this.styleUpdate(waitTime, "#" + j, this.tempArr[j], this.color.normal);
          waitTime += this.timeout;
        }
      }

      temp = this.tempArr[minIndex];
      this.tempArr[minIndex] = this.tempArr[i];
      this.tempArr[i] = temp;

      this.styleUpdate(waitTime, "#" + i, this.tempArr[i], this.color.ok);
      this.styleUpdate(waitTime, "#" + minIndex, this.tempArr[minIndex], this.color.ok);
      waitTime += this.timeout;

      this.styleUpdate(waitTime, "#" + i, this.tempArr[i], this.color.normal);
      this.styleUpdate(waitTime, "#" + minIndex, this.tempArr[minIndex], this.color.normal);
      waitTime += this.timeout;
    }

    this.allCorrectAnimation(waitTime);
  }

  styleUpdate(waitTime: number, element: string, height: number, color: string) {
    setTimeout(() => {
      $(element).css("height", (height / 2) + "px");
      $(element).css("background-color", color);
    }, waitTime);
  }

  allCorrectAnimation(waitTime: number) {
    waitTime += 300;

    for(let k = 2; k < (this.arraySize + 3); k++) {
      this.styleUpdate(waitTime, "#" + (k - 2), this.tempArr[k - 2], this.color.ok);
      this.styleUpdate(waitTime, "#" + (k - 1), this.tempArr[k - 1], this.color.ok);
      this.styleUpdate(waitTime, "#" + k, this.tempArr[k], this.color.ok);
      this.styleUpdate(waitTime, "#" + (k - 3), this.tempArr[k - 3], this.color.normal);
      waitTime += 35;
    }

    this.enableAll(waitTime);
  }

  enableAll(waitTime: number) {
    setTimeout(() => {
      this.disable = false;
    }, waitTime);
  }
}
