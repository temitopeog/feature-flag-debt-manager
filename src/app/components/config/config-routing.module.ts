import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigComponent } from './config.component';


const routes: Routes = [
  {
    path: '',
    component: ConfigComponent,
    data: { title: 'config' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule {}
