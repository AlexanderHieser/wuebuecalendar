import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import * as streets from './../assets/streets.json';
import * as ics from 'ics';

interface Location {
  name: string;
  code: number;
}

interface Street {
  name: string,
  value: string,
  id: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  locations: Location[];
  selectedLocation: string;
  title = 'RubbishExport';
  streetData: Street[] = streets['default'];
  events: any[];
  selectedStreet: Street;
  display = false;

  constructor(private http: HttpClient) { }

  /**
   * Get events from API
   */
  getEvents() {
    if (this.selectedStreet) {
      // Setup query params
      let params = {
        '_func': 'evList',
        '_mod': 'events',
        'ev[start]': '2021-01-01',
        'ev[end]': '2021-12-31',
        'ev[addr]': this.selectedStreet.value,
        'ev[search]': '',
        '_y': '2021',
        '_m': '01',
      }

      /**
       * Make request for selected street
       */
      this.http.get('https://www.wuerzburg.de/themen/umwelt-verkehr/vorsorge-entsorgung/abfallkalender/index.html', { params: params }).subscribe((data) => {
        console.log(data);
        let keys = Object.keys(data['contents']);
        this.events = new Array<any>();
        console.log(keys);
        this.events = new Array<any>();
        keys.forEach(k => {
          let jsonData = data['contents'][k];
          let set = {
            title: jsonData.title,
            start: jsonData.start.split(' ')[0].split('-'),
            end: jsonData.start.split(' ')[0].split('-'),
          }
          this.events.push(set);
        });
        console.log("Events", this.events);
        const value = ics.createEvents(this.events);
        console.log(value);
        this.downloadBlob(this.selectedStreet.name + '-2021' + '.ics', value.value);
      });
    } else {
      this.display = true;
    }
  }

  /**
   * Create Download 
   * @param file_name Filename
   * @param content ICS COntent
   */
  downloadBlob(file_name, content) {
    var csvData = new Blob([content], { type: 'text/calendar' });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for IE
      window.navigator.msSaveOrOpenBlob(csvData, file_name);
    } else { // for Non-IE (chrome, firefox etc.)
      var a = document.createElement("a");
      document.body.appendChild(a);
      var csvUrl = URL.createObjectURL(csvData);
      a.href = csvUrl;
      a.download = file_name;
      a.click();
      URL.revokeObjectURL(a.href)
      a.remove();
    }
  };
}
