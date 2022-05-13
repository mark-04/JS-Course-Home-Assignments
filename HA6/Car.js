'use strict';

const isInvalidBrandName = (value) => (
  typeof value !== 'string' ||
  value.length < 1          ||
  value.length > 50
);
const isInvalidModelName = isInvalidBrandName;

const currentYear = new Date().getFullYear();
const isInvalidYearOfManufacturing = (value) => (
  typeof value !== 'number' ||
  value < 1900              ||
  value > currentYear
);

const isInvalidMaxSpeed = (value) => (
  typeof value !== 'number' ||
  value < 100               ||
  value > 300
);

const isInvalidMaxFuelVolume = (value) => (
  typeof value !== 'number' ||
  value < 5                 ||
  value > 20
);

const isInvalidFuelConsumption = (value) => (
  typeof value !== 'number' ||
  Number.isNaN(value)       ||
  value === Infinity        ||
  value <= 0
);
const isInvalidFillUp = isInvalidFuelConsumption;
const isInvalidSpeedNumber = isInvalidFillUp; 
const isInvalidHourNumber = isInvalidFillUp; 




class Car {
  #brand;
  #model;
  #yearOfManufacturing;
  #maxSpeed;
  #maxFuelVolume;
  #fuelConsumption;
  #currentFuelVolume;
  #isStarted;
  #mileage;

  constructor () {
    this.#currentFuelVolume = 0;
    this.#isStarted = false;
    this.#mileage = 0;
  };

  get currentFuelVolume() {
    return this.#currentFuelVolume;
  };

  get isStarted() {
    return this.#isStarted;
  };

  get mileage() {
    return this.#mileage;
  };

  get brand() {
    return this.#brand;
  };

  set brand(name) {
    if(isInvalidBrandName(name)) {
      throw new Error('`brand` field must be a string of length between 1 and 50 chars');
    };

    this.#brand = name;
  };

  get model() {
    return this.#model;
  };

  set model(name) {
    if(isInvalidModelName(name)) {
      throw new Error('`model` field must be a string of length between 1 and 50 chars');
    };

    this.#model = name;
  };

  get yearOfManufacturing() {
    return this.#yearOfManufacturing
  };

  set yearOfManufacturing(year) {
    if (isInvalidYearOfManufacturing(year)) {
      throw new Error('`yearOfManufacturing` field must be a number between 1900 and the current year');
    };

    this.#yearOfManufacturing = year;
  };

  get maxSpeed() {
    return this.#maxSpeed;
  };

  set maxSpeed(speed) {
    if (isInvalidMaxSpeed(speed)) {
      throw new Error('`maxSpeed` field must be a number between 100 and 300 km per hour');
    };

    this.#maxSpeed = speed;
  };

  get maxFuelVolume() {
    return this.#maxFuelVolume;
  };

  set maxFuelVolume(volume) {
    if (isInvalidMaxFuelVolume(volume)) {
      throw new Error('`maxFuelVolume` field must be a number between 5 and 50 liters');
    };

    this.#maxFuelVolume = volume;
  };

  get fuelConsumption() {
    return this.#fuelConsumption;
  };

  set fuelConsumption(liters) {
    if (isInvalidFuelConsumption(liters)) {
      throw new Error('`fuelConsumption` field must be a number that is more than zero');
    };

    this.#fuelConsumption = liters;
  };

  start() {
    if (this.#isStarted) {
      throw new Error('The car is already started');
    };

    this.#isStarted = true;
  };

  shutDownEngine() {
    if (!this.#isStarted) {
      throw new Error('The car is not yet started');
    };

    this.#isStarted = false;
  };

  fillUpGasTank(liters) {
    if (isInvalidFillUp(liters)) {
      throw new Error('Invalid number of liters for the fill-up');
    };

    const fuelVolumeAfterFillUp = this.#currentFuelVolume + liters;

    if (fuelVolumeAfterFillUp > this.#maxFuelVolume) {
      throw new Error('The fuel tank is overfilled');
    };

    this.#currentFuelVolume = fuelVolumeAfterFillUp;
  };

  drive(speed, hours) {
    if (isInvalidSpeedNumber(speed)) {
      throw new Error('Invalid speed');
    };

    if (isInvalidHourNumber(hours)) {
      throw new Error('Invalid number of hours');
    };

    if (speed > this.#maxSpeed) {
      throw new Error('The car cannot drive so fast');
    };

    if (!this.#isStarted) {
      throw new Error('The car must be started before it can drive');
    };
    
    const distance = speed * hours; 
    const requiredFuelVolume = (distance / 100) * this.#fuelConsumption;

    if (requiredFuelVolume > this.#currentFuelVolume) {
      throw new Error('The car has not enough fuel for the drive');
    };

    this.#currentFuelVolume -= requiredFuelVolume;
    this.#mileage += distance;
  };
};