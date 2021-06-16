import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-search-by-lake-features',
  templateUrl: './search-by-lake-features.component.html',
  styleUrls: ['./search-by-lake-features.component.css']
})
export class SearchByLakeFeaturesComponent implements OnInit {

  LakeSize: any[] = [];
  Depth: any[] = [];
  PublicAccess: boolean = false;
  LakeTable: any[] = [];

  constructor(private apiService: ApiService) { }

  public GoToLake(lakeid){
    window.open("https://www.dnr.state.mn.us/lakefind/lake.html?id=" + lakeid,'_blank');
  }

  public GoToWaterAccess(lakeid){
    window.open("https://www.dnr.state.mn.us/lakefind/was/report.html?id=" + lakeid, '_blank');
  }

  async SearchLakes() {
    this.LakeTable = [];
    for(let county=0;county<88;county++){
      await this.apiService.GetLakesByCounty(county).then(lakeresult => {
        if(lakeresult.results != null){
          if(lakeresult.results.length != 0){
            lakeresult.results = lakeresult.results.filter(x => x.morphology.area > this.LakeSize[0] && x.morphology.area <= this.LakeSize[1])
            lakeresult.results = lakeresult.results.filter(x => x.morphology.max_depth >= this.Depth[0] && x.morphology.max_depth <= this.Depth[1])
            lakeresult.results = lakeresult.results.filter(x => x.resources.waterAccess == this.PublicAccess)
            console.log(lakeresult.results);
            lakeresult.results.forEach(lake => {
              this.LakeTable.push(lake);
            })
          }
        }
      })
    }
  }

  ngOnInit(): void {
  }

}
