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
  streetData:Street[] = streets['default'];
  events: any[];
  selectedStreet: Street;


  /* 
    <option value="" selected>Alle Standorte</option>
    <option value="19935">Altstadt</option>
    <option value="19936">D&uuml;rrbach alle mit Hafen</option>
    <option value="19937">Frauenland</option>
    <option value="19938">Gromb&uuml;hl</option>
    <option value="19939">Heidingsfeld</option>
    <option value="403107">Heuchelhof aussen</option>
    <option value="403108">Heuchelhof innen</option>
    <option value="19941">Lengfeld</option>
    <option value="19942">Lindleinsm&uuml;hle</option>
    <option value="403103">Mainviertel</option>
    <option value="401083">Pilziggrund</option>
    <option value="19940">Rottenbauer</option>
    <option value="19943">Sanderau</option>
    <option value="19944">Steinbachtal</option>
    <option value="19945">Versbach</option>
    <option value="19946">Zellerau</option> */

  constructor(private http:HttpClient) {
    this.locations = [{
      name: 'Altstadt',
      code: 19935
    }, {
      name: 'Dürrbach alle mit Hafen',
      code: 19936
    }, {
      name: 'Frauenlad',
      code: 19937
    }, {
      name: 'Grombühl',
      code: 19938
    }, {
      name: 'Heidingsfeld',
      code: 19939
    }, {
      name: 'Heuchelhof aussen',
      code: 403107
    }, {
      name: 'Heuchelhof innen',
      code: 403108
    }];
    console.log(this.streetData[0]);
  }

  getEvents() {
    let params = {
      '_func' :'evList',
      '_mod':'events',
      'ev[start]':'2021-01-01',
      'ev[end]':'2021-12-31',
      'ev[addr]':this.selectedStreet.value,
      'ev[search]':'',
      '_y':'2021',
      '_m':'01' ,
    }
    this.http.get('https://www.wuerzburg.de/themen/umwelt-verkehr/vorsorge-entsorgung/abfallkalender/index.html', { params: params}).subscribe((data) => {
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
      })
      console.log("Events",this.events);
      const value = ics.createEvents(this.events);
      console.log(value);
      
      this.download(this.selectedStreet.name+'-2021'+'.ics',value.value);

    });
    
  }

  download(filename, data) {
    var element = document.createElement('a');
    window.open('data:text/calendar;charset=utf8,' + escape(data));
    // element.setAttribute('download', filename);
  
    // element.style.display = 'none';
    // document.body.appendChild(element);
  
    // element.click();
  
    // document.body.removeChild(element);
  }
}
