import test from 'node:test';
import assert from 'node:assert/strict';
import { locations, getDemoRoutes, nearestJourneyLocation } from '../src/data/demoJourneys.js';
import { demoHubs, filterDemoHubs } from '../src/data/demoHubs.js';

test('hub coordinates are stable Trichy points and filtering retains their identities', () => {
  assert.equal(new Set(demoHubs.map(hub => hub.id)).size, 6);
  for (const hub of demoHubs) {
    assert(hub.latitude > 10.7 && hub.latitude < 10.9);
    assert(hub.longitude > 78.6 && hub.longitude < 78.8);
  }
  assert.deepEqual(filterDemoHubs(' chathiram ', ['charging']).map(hub => hub.id), ['chathiram-waiting']);
  assert.deepEqual(filterDemoHubs('no match', []), []);
});

test('every direction has three distinct paths with correctly ordered endpoints', () => {
  for (const start of locations) for (const destination of locations) {
    const routes = getDemoRoutes(start.id, destination.id);
    if (start.id === destination.id) { assert.equal(routes.length, 0); continue; }
    assert.equal(routes.length, 3);
    assert.equal(new Set(routes.map(route => JSON.stringify(route.geometry))).size, 3);
    routes.forEach((route, index) => {
      assert.deepEqual(route.geometry[0], start.coordinates);
      assert.deepEqual(route.geometry.at(-1), destination.coordinates);
      assert.deepEqual(route.geometry, [...getDemoRoutes(destination.id, start.id)[index].geometry].reverse());
      assert(route.geometry.flat().every(Number.isFinite));
    });
  }
});

test('only nearby positions select a supported planning area', () => {
  assert.equal(nearestJourneyLocation({ latitude: 10.8187, longitude: 78.6823 }).id, 'thillai');
  assert.equal(nearestJourneyLocation({ latitude: -26.2, longitude: 28.04 }), null);
});
