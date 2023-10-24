import { test } from 'owasp-password-strength-test';

export type ValidatorMessages = string[];

export interface ValidatorResponse {
  valid: boolean;
  message: ValidatorMessages;
}

export class Validator {
  private validState: ValidatorResponse = {
    valid: true,
    message: ['OK']
  };

  constructor() {}

  hasValue(value: string): ValidatorResponse {
    let valid = value !== '' && value !== undefined;
    this.validState = {
      valid,
      message: valid ? ['OK'] : ['This field is required.']
    }
    return this.validState;
  }

  isValidEmail(value: string): ValidatorResponse {
    let valid = /\S+@\S+\.\S+/.test(value);
    this.validState = {
      valid,
      message: valid ? ['OK'] : ['Please enter a valid email address.']
    }
    return this.validState;
  }

  isValidPassword(value: string): ValidatorResponse {
    let valid = true;
    const passwordResult = test(value);
    valid = passwordResult.errors.length === 0;
    return {
      valid,
      message: valid ? ['OK'] : passwordResult.errors
    }
  }

  valuesMatch(value1: string, value2: string, label: string): ValidatorResponse {
    let valid = value1 === value2;
    return {
      valid,
      message: valid ? ['OK'] : ['The ' + label + ' fields do not match.']
    }
  }
}
