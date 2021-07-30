import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, ElementRef, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { of, Subscription, timer } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';
import {Howl, Howler} from 'howler';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'eorange-script';
  msaapDisplayTitle = true;
msaapDisplayPlayList = true;
msaapPageSizeOptions = [2,4,6];
msaapDisplayVolumeControls = true;
msaapDisplayRepeatControls = true;
msaapDisplayArtist = false;
msaapDisplayDuration = false;
msaapDisablePositionSlider = true;
  @Output() data:any;
  apiUrl = 'https://www.eorange.shop/json/suggest?search=YAMAHA';
  bajajUrl = 'https://www.eorange.shop/json/suggest?search=Bajaj';
  hondaUrl = 'https://www.eorange.shop/json/suggest?search=Honda';
  @Input() intervalPeriod: number;
  text:any;
  minutes: number;
  subscription: Subscription;
  call=0;
  @ViewChild('audioOption') audioPlayerRef: ElementRef;
  subscriptionbajaj: Subscription;
  subscriptionHonda: Subscription;
  constructor(private http: HttpClient) {}
onAudioPlay(){
  this.audioPlayerRef.nativeElement.play();
}
  ngOnInit() {
    this.minutes =  10000;
    this.checkYamaha();
    this.checkBajaj();
    this.checkHonda();

  }
  checkYamaha(){
    this.subscription = timer(0, this.minutes)
      .pipe(
        switchMap(() => {
          return this.getData().pipe(
            catchError(err => {
              // Handle errors
              console.error(err);
              return of(undefined);
            })
          );
        }),
        filter(data => data !== undefined)
      )
      .subscribe(data => {
        this.data = data;
        this.call++;
         console.log("Current Call in this session ",this.call, "at date: ",new Date().toLocaleString());
        this.data.forEach(element => {

          this.text=`Current stock of: ${element.name} ${element.stock}`
          if(element.name=="Yamaha R15 v3  Motorcycle (Indonesian Version)"||element.name=="YAMAHA R15 V3 BS6 Indian Motorcycle"|| element.name=="YAMAHA MT-15 Indonesian Motorcycle")
          {

            console.log("Current stock of ",element.name ,element.stock);


              if(element.stock>0){

            this.playAudio();
          }

        }
        });

      });

  }
  checkBajaj(){
    this.subscriptionbajaj = timer(0, this.minutes)
      .pipe(
        switchMap(() => {
          return this.getBajajData().pipe(
            catchError(err => {
              // Handle errors
              console.error(err);
              return of(undefined);
            })
          );
        }),
        filter(data => data !== undefined)
      )
      .subscribe(data => {
        this.data = data;
        this.call++;
         console.log("Current Call in this session ",this.call, "at date: ",new Date().toLocaleString());
        this.data.forEach(element => {

          if(element.name=="Bajaj Pulsar 150 CC Single Disc"||element.name=="Bajaj Pulsar 150 CC Twin DIsc"|| element.name=="BAJAJ Platina 100 ES Motor Cycle")
          {

            console.log("Current stock of ",element.name ,element.stock);


              if(element.stock>0){

            this.playAudio();
          }

        }
        });

      });
  }
  getBajajData(){
    return this.http.get(this.bajajUrl);

  }
  getHondaData(){
    return this.http.get(this.hondaUrl);

  }
  playAudio(){
//  let audio = new Audio();

//   audio.src = "assets/Imagine-Dragons-Believer.mp3";
//   audio.load();
//   audio.play();
var sound = new Howl({
            src: ['assets/Imagine-Dragons-Believer.mp3'],
            loop: true,
            volume: 0.5,
            onend: function() {
                console.log('Finished!');
            }
        });
        sound.play();

}
checkHonda(){
    this.subscriptionHonda = timer(0, this.minutes)
      .pipe(
        switchMap(() => {
          return this.getHondaData().pipe(
            catchError(err => {
              // Handle errors
              console.error(err);
              return of(undefined);
            })
          );
        }),
        filter(data => data !== undefined)
      )
      .subscribe(data => {
        this.data = data;
        this.call++;
         console.log("Current Call in this session ",this.call, "at date: ",new Date().toLocaleString());
        this.data.forEach(element => {

          if(element.name=="Honda Livo 110CC Motorcycle"||element.name=="Honda Shine SP 125CC Motorcycle"|| element.name=="Honda Hornet 160R Abs Motorcycle"|| element.name=="Honda Dio DX (MotoScooter) Scooty"|| element.name=="Honda Livo Drum 110cc Motorcycle")
          {

            console.log("Current stock of ",element.name ,element.stock);


              if(element.stock>0){

            this.playAudio();
          }

        }
        });

      });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionbajaj.unsubscribe();
    this.subscriptionHonda.unsubscribe();
  }

  getData() {
    let params = new HttpParams();
   const headers = new HttpHeaders({ 'Content-Type': 'text/plain'});
    return this.http.get(this.apiUrl);
  }
}
