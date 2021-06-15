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

  fishtable: any[] = [];

  constructor(private apiService: ApiService) { }

  private GetLengthCount(survey, species, min, max, show) {
    let count = 0;
    //console.log(survey.lengths[species]);
    if(survey.lengths[species] != undefined){
      for (let i = 0; i<survey.lengths[species].fishCount.length; i++){
        if (survey.lengths[species].fishCount[i][0] >= min && survey.lengths[species].fishCount[i][0] <= max){
          //console.log(survey.lengths[species].fishCount)
          count += survey.lengths[species].fishCount[i][1];
        }
      }
    }
    return count;

  }

  private revealfishlengthstats(survey){
    let fishlen = [];
    fishlen.push(this.GetLengthCount(survey, this.speciesInput, 0,5,false));
    fishlen.push(this.GetLengthCount(survey, this.speciesInput, 6,7,false));
    fishlen.push(this.GetLengthCount(survey, this.speciesInput, 8,9,false));
    fishlen.push(this.GetLengthCount(survey, this.speciesInput, 10,11,false));
    fishlen.push(this.GetLengthCount(survey, this.speciesInput, 12,14,false));
    fishlen.push(this.GetLengthCount(survey, this.speciesInput, 15,19,false));
    fishlen.push(this.GetLengthCount(survey, this.speciesInput, 20,24,false));
    fishlen.push(this.GetLengthCount(survey, this.speciesInput, 25,29,false));
    fishlen.push(this.GetLengthCount(survey, this.speciesInput, 30,34,false));
    fishlen.push(this.GetLengthCount(survey, this.speciesInput, 35,39,false));
    fishlen.push(this.GetLengthCount(survey, this.speciesInput, 40,44,false));
    fishlen.push(this.GetLengthCount(survey, this.speciesInput, 45,49,false));
    fishlen.push(this.GetLengthCount(survey, this.speciesInput, 50,100,false));
    fishlen.push(this.GetLengthCount(survey, this.speciesInput, 0,100,false));
    return fishlen;
  }

  async searchLakes(countyInput) {
    //console.log(this.countyInput);
    //console.log(this.speciesInput);
    if(countyInput == 0){
      for(let i=1;i<88;i++){
        await this.apiService.GetLakesByCounty(i).subscribe(lakes => {
          //console.log(lakes);
          if(lakes.results.length != 0){
            lakes.results.forEach(element => {
              // this.lakeArray.push(element);
              // console.log(this.lakeArray);
              //console.log(element.id)
              this.apiService.GetLakeData(element.id).subscribe(survey => {
                if(survey.status == "SUCCESS" && survey.message == "Normal execution."){
                  let surveyData = survey.result.surveys;
                  surveyData.forEach(data => {
                    data.surveyDate = new Date(data.surveyDate);
                  })
                  surveyData.sort((a,b) => {
                    return a.surveyDate-b.surveyDate;
                  });
                  surveyData = surveyData.filter(x => x.surveyType == "Standard Survey")
                  let speciesdata = surveyData[surveyData.length-1].fishCatchSummaries;
                  speciesdata = speciesdata.filter(fish => fish.species == this.speciesInput);
                  //console.log("speciesData", speciesdata);
                  if (speciesdata.length != 0) {
                    let fishlenarray = this.revealfishlengthstats(surveyData[surveyData.length-1]);
                    this.fishtable.push({name: element.name, speciesdata: speciesdata[speciesdata.length-1], fishlengths: fishlenarray})
                    console.log("Lake:", element.name);
                    console.log(fishlenarray);
                    console.log(speciesdata[speciesdata.length-1]);
                  }
                }
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
        //console.log(this.lakeArray)
        if(this.lakeArray.length != 0){
          this.lakeArray.forEach(lake => {
            this.apiService.GetLakeData(lake.id).subscribe(survey => {
              if(survey.status == "SUCCESS" && survey.message == "Normal execution."){
                let surveyData = survey.result.surveys;
                surveyData.forEach(data => {
                  data.surveyDate = new Date(data.surveyDate);
                })
                surveyData.sort((a,b) => {
                  return a.surveyDate-b.surveyDate;
                });
                //surveyData = surveyData.filter(x => x.surveyType == "Standard Survey")
                let speciesdata = surveyData[surveyData.length-1].fishCatchSummaries;
                speciesdata = speciesdata.filter(fish => fish.species == this.speciesInput);
                //console.log("speciesData", speciesdata);
                if (speciesdata.length != 0) {
                  let fishlenarray = this.revealfishlengthstats(surveyData[surveyData.length-1]);
                  this.fishtable.push({name: lake.name, speciesdata: speciesdata[speciesdata.length-1], fishlengths: fishlenarray})
                  console.log("Lake:", lake.name);
                  console.log(fishlenarray);
                  console.log(speciesdata[speciesdata.length-1]);
                }
              }
            })
          })
        }
      });
    }

  }

  ngOnInit(): void {
  }

}
