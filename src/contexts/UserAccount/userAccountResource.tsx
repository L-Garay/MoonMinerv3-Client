import React from 'react';

class BaseResource {
  data = undefined;
  status = 'pending';
  error = undefined;
  promise = null;
  read() {
    switch (this.status) {
      case 'pending':
        throw this.promise;
      case 'error':
        throw this.error;
      default:
        return this.data;
    }
  }
}

class AsyncResource extends BaseResource {
  constructor(promise) {
    super();
    this.promise = promise
      .then((data) => {
        this.status = 'success';
        this.data = data;
      })
      .catch((error) => {
        this.status = 'error';
        this.error = error;
      });
  }
}

class ObservableResource extends BaseResource {
  observers;
  constructor(promise) {
    super();
    this.promise = promise
      .then((data) => this.onNext(data))
      .catch((error) => this.onError(error));
  }
  onNext(data) {
    this.status = 'success';
    this.data = data;
    this.observers.forEach(
      ({ onNext }) => typeof onNext === 'function' && this.onNext(this.data)
    );
  }
  onError(error) {
    this.status = 'error';
    this.error = error;
    this.observers.forEach(
      ({ onError }) => typeof onError === 'function' && this.onError(this.error)
    );
  }
  observe(onNext, onError) {
    const observer = { onNext, onError };
    this.observers.push(observer);
    return () => {
      this.observers = this.observers.filter((other) => other !== observer);
    };
  }
}
