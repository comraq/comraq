import gulp from "gulp";
import wagner from "wagner-core";

import setConfig from "./gulp/config";
import setPaths from "./gulp/paths";
import setTasksList from "./gulp/tasks-list";

wagner.factory("gulp", () => gulp);

// Gulp initilization configuration
setConfig(wagner);

// Path constants
setPaths(wagner);

// Gulp tasks list
wagner.invoke(setTasksList);
