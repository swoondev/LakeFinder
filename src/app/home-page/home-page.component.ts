import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../api.service';

import {staticcontent} from '../global/globals';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

export class HomePageComponent implements OnInit {
  countyInput: string;
  speciesInput: string;
  lakeArray: any[] = [];
  counties: {County: string, Id: number}[] = staticcontent.counties;
  species: {Species: string, Id: string}[] = staticcontent.Species;

  constructor(private apiService: ApiService) { }

  async searchLakes(countyInput) {
    console.log(this.countyInput);
    console.log(this.speciesInput);
    if(countyInput == 0){
      for(let i=1;i<88;i++){
        await this.apiService.GetLakesByCounty(i).subscribe(lakes => {
          console.log(lakes);
          if(lakes.results.length != 0){
            lakes.results.forEach(element => {
              this.lakeArray.push(element);
              this.apiService.GetLakeData(element.Id).subscribe(survey => {
                console.log(survey);
              })
            });
          }
        })
      }
    }
    else{
      await this.apiService.GetLakesByCounty(countyInput).subscribe(async lakes => {
        if(lakes.results.length != 0){
          this.lakeArray = lakes.results
        }
        if(this.lakeArray.length != 0){
          this.lakeArray.forEach(lake => {
            this.apiService.GetLakeData(lake.Id).subscribe(survey => {
              console.log("survey", survey);
            })
          })
        }
      });
      console.log("Lake Array", this.lakeArray);
    }

  }

  ngOnInit(): void {
  }

}
