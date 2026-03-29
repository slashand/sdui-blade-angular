import '@angular/compiler';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';
import 'zone.js';
import 'zone.js/testing';

console.log('--- TEST SETUP RUNNING ---');
try {
  getTestBed().initTestEnvironment(
    BrowserTestingModule,
    platformBrowserTesting(),
  );
  console.log('--- TEST BED INIT SUCCESS ---');
} catch (e) {
  console.log('--- TEST BED ALREADY INITED OR FAILED ---', e);
}
