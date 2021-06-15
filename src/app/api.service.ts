import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable }  from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  lakefinder_api = "https://maps2.dnr.state.mn.us/cgi-bin/lakefinder_json.cgi?";
  lake_survey_api = "https://maps2.dnr.state.mn.us/cgi-bin/lakefinder/detail.cgi?";
  office_api = "https://maps1.dnr.state.mn.us/cgi-bin/offices.cgi";

  constructor(private httpClient: HttpClient) { }

  

  public GetLakesByCounty(id) {
    return this.httpClient.get<any>(this.lakefinder_api, {
      params: new HttpParams().append("county", id)
    }).toPromise()
  }

  public GetLakeData(id){
    return this.httpClient.get<any>(this.lake_survey_api, {
      params: new HttpParams().append("type", "lake_survey").append("id", id)
    }).toPromise();
  }
}
