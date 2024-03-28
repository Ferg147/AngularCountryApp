import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: ``
})
export class SearchBoxComponent implements OnInit, OnDestroy {

  private debouncer = new Subject<string>;
  private debouncerSubcription? = new Subscription;

  @Input()
  public placeholder:string = '';

  @Input()
  public initialValue:string = '';

  @Output()
  public onValue = new EventEmitter<string>(); 

  @Output()
  public onDebaunce = new EventEmitter<string>(); 

  ngOnInit(): void {
    this.debouncerSubcription = this.debouncer
    .pipe(
      debounceTime(300)
    )
    .subscribe(value => {
      this.onDebaunce.emit(value);
    });
  }

  constructor( ) {}
  ngOnDestroy(): void {
    this.debouncerSubcription?.unsubscribe();  
  }

  emitValue(value: string):void{
    this.onValue.emit(value);
  }

  onKeyPress( searchTerm:string){
      this.debouncer.next(searchTerm);
  }

}
