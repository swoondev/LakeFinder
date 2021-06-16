import { Component, OnInit } from '@angular/core';
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
  searchstatus: string;
  currentcounty: string;
  lakeCount: string;
  countyCount: string;

  constructor(private apiService: ApiService) { }

  public GoToLake(lakeid){
    window.open("https://www.dnr.state.mn.us/lakefind/lake.html?id=" + lakeid,'_blank');
  }

  public GoToWaterAccess(lakeid){
    window.open("https://www.dnr.state.mn.us/lakefind/was/report.html?id=" + lakeid, '_blank');
  }

  private GetLengthCount(survey, species, min, max, show) {
    let count = 0;
    if(survey.lengths[species] != undefined){
      for (let i = 0; i<survey.lengths[species].fishCount.length; i++){
        if (survey.lengths[species].fishCount[i][0] >= min && survey.lengths[species].fishCount[i][0] <= max){
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
    this.searchstatus = "Initializing search..."
    this.fishtable = [];
    //Search all of MN
    if(countyInput == 0){
      for(let i=1;i<88;i++){
        this.countyCount = "(" + i + "/87 counties)"
        //Retrieve all lakes in specified county
        await this.apiService.GetLakesByCounty(i).then(lakes => {
          this.searchstatus = "retrieving lakes..."
          if(lakes.results != null){
            if(lakes.results.length != 0){
              //Filter lakes for only lakes w/ specified species
              lakes.results = lakes.results.filter(x => 
                x.fishSpecies.includes(this.species.find(x => x.Id == this.speciesInput).Species.toLowerCase())
              )
              lakes.results.forEach(async (element, index) => {
                this.currentcounty = element.county;
                //Get Lake Survey Data
                await this.apiService.GetLakeData(element.id).then(survey => {
                  this.searchstatus = "retrieving data for Lake " + element.name
                  this.lakeCount = "(" + index + "/" + (lakes.results.length-1) + " lakes)"
                  if(survey.status == "SUCCESS" && survey.message == "Normal execution."){
                    let surveyData = survey.result.surveys;
                    //Sort Surveys by Survey Date
                    surveyData.forEach(data => {
                      data.surveyDate = new Date(data.surveyDate);
                    })
                    surveyData.sort((a,b) => {
                      return a.surveyDate-b.surveyDate;
                    });
                    //Only use standard surveys
                    surveyData = surveyData.filter(x => x.surveyType == "Standard Survey")
                    if(surveyData[surveyData.length-1] != undefined){
                      let speciesdata = surveyData[surveyData.length-1].fishCatchSummaries;
                      //retrieve catch summaries for specific species
                      speciesdata = speciesdata.filter(fish => fish.species == this.speciesInput);
                      if (speciesdata.length != 0) {
                        //retrieve fish lengths from catch summary
                        let fishlenarray = this.revealfishlengthstats(surveyData[surveyData.length-1]);
                        //only add to table if total sample size > 0
                        if(fishlenarray[13] != 0){
                          this.fishtable.push({name: element.name, speciesdata: speciesdata[speciesdata.length-1], fishlengths: 
                            {
                            "zero": fishlenarray[0], 
                            "one": fishlenarray[1], 
                            "two": fishlenarray[2], 
                            "three": fishlenarray[3],
                            "four": fishlenarray[4],
                            "five": fishlenarray[5],
                            "six": fishlenarray[6],
                            "seven": fishlenarray[7],
                            "eight": fishlenarray[8],
                            "nine": fishlenarray[9],
                            "ten": fishlenarray[10],
                            "eleven": fishlenarray[11],
                            "twelve": fishlenarray[12],
                            "total": fishlenarray[13],
                          }, surveyDate: surveyData[surveyData.length-1].surveyDate,
                          lakeid: element.id
                        })
                        }
                      }
                    }
                  }
                }).finally(() => {
                  if(index == lakes.results.length-1) {
                    this.searchstatus = "Search complete!"
                }
              })
              });
            }
          }
        })
      }
    }
    //Search one county
    else{
      //get lakes for specific county
      await this.apiService.GetLakesByCounty(countyInput).then(async lakes => {
        this.searchstatus = "retrieving lakes..."
        if(lakes.results.length != 0){
          this.lakeArray = lakes.results
        }
        if(this.lakeArray.length != 0){
          //filter lakes for specified species
          this.lakeArray = this.lakeArray.filter(x => 
            x.fishSpecies.includes(this.species.find(x => x.Id == this.speciesInput).Species.toLowerCase())
          )
          this.lakeArray.forEach(async (lake, index) => {
            //for each lake, retrieve lake survey
            await this.apiService.GetLakeData(lake.id).then(survey => {
              this.searchstatus = "retrieving data for Lake " + lake.name
              if(survey.status == "SUCCESS" && survey.message == "Normal execution."){
                this.lakeCount = "(" + index + "/" + (this.lakeArray.length-1) + " lakes)"
                let surveyData = survey.result.surveys;
                //sort surveys by date
                surveyData.forEach(data => {
                  data.surveyDate = new Date(data.surveyDate);
                })
                surveyData.sort((a,b) => {
                  return a.surveyDate-b.surveyDate;
                });
                //filter surveys for only standard survey
                surveyData = surveyData.filter(x => x.surveyType == "Standard Survey")
                if(surveyData[surveyData.length-1] != undefined){
                  //capture catch summary for last survey
                  let speciesdata = surveyData[surveyData.length-1].fishCatchSummaries;
                  //filter catch summaries for specific species
                speciesdata = speciesdata.filter(fish => fish.species == this.speciesInput);
                if (speciesdata.length != 0) {
                  //retrieve fish length for catch summary
                  let fishlenarray = this.revealfishlengthstats(surveyData[surveyData.length-1]);
                  //if total catch > 0, add to table
                  if(fishlenarray[13] != 0){
                    this.fishtable.push({name: lake.name, speciesdata: speciesdata[speciesdata.length-1], fishlengths: 
                      {
                      "zero": fishlenarray[0], 
                      "one": fishlenarray[1], 
                      "two": fishlenarray[2], 
                      "three": fishlenarray[3],
                      "four": fishlenarray[4],
                      "five": fishlenarray[5],
                      "six": fishlenarray[6],
                      "seven": fishlenarray[7],
                      "eight": fishlenarray[8],
                      "nine": fishlenarray[9],
                      "ten": fishlenarray[10],
                      "eleven": fishlenarray[11],
                      "twelve": fishlenarray[12],
                      "total": fishlenarray[13]
                      }, surveyDate: surveyData[surveyData.length-1].surveyDate,
                      lakeid: lake.id
                    })
                  }
                };
              };
            }
          }).finally(() => {
            if(index == this.lakeArray.length-1) {
              this.searchstatus = "Search complete!"
          }
        })
        });
      };
    })
  };

}

  ngOnInit(): void {
  }

}
