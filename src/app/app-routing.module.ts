import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { SearchByLakeComponent } from './search-by-lake/search-by-lake.component';
import { SearchByLakeFeaturesComponent } from './search-by-lake-features/search-by-lake-features.component';


const routes: Routes = [
  {path: 'lakesearch', component: SearchByLakeComponent},
  {path: 'lakefeature', component: SearchByLakeFeaturesComponent},
  {path: 'LakeFinder', component: HomePageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
