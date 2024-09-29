import { Routes } from '@angular/router';
import { SortingVisualizerComponent } from './sorting-visualizer/sorting-visualizer.component';

export const routes: Routes = [
    { path: "visualizer", component: SortingVisualizerComponent },
    { path: "", redirectTo: "/visualizer", pathMatch: "full" }
];
