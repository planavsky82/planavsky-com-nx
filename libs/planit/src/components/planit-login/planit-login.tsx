import { Component, ComponentInterface, Host, h, Prop, Event, EventEmitter, State } from '@stencil/core';
import { Validator, ValidatorMessages } from '../../utils/validator';

export interface LoginEvent {
  email: string;
  pwd: string;
}

@Component({
  tag: 'planit-login',
  styleUrl: 'planit-login.css',
  shadow: true,
})
export class PlanitLogin implements ComponentInterface {
  @Prop() labelEmailAddress: string = "Email Address";
  @Prop() labelPassword: string = "Password";

  @Event() submitLogin: EventEmitter<LoginEvent>;

  @State() email: string;
  @State() pwd: string;

  private validator: Validator = new Validator();

  public emailErrorMessage: ValidatorMessages;
  public pwdErrorMessage: ValidatorMessages;

  constructor() {}

  handleSubmit(event: Event) {
    event.preventDefault();
    this.submitLogin.emit({
      email: this.email,
      pwd: this.pwd
    });
  }

  handleEmailChange(event: Event) {
    this.emailErrorMessage = undefined;
    const target = event.target as HTMLInputElement;
    this.email = target.value;
    let value = this.validator.hasValue(this.email);
    if (value.valid) {
      value = this.validator.isValidEmail(this.email);
    }
    if (!value.valid) {
      this.emailErrorMessage = value.message;
    }
  }

  handlePwdChange(event: Event) {
    this.pwdErrorMessage = undefined;
    const target = event.target as HTMLInputElement;
    this.pwd = target.value;
    let value = this.validator.hasValue(this.pwd);
    if (!value.valid) {
      this.pwdErrorMessage = value.message;
    }
  }

  render() {
    return (
      <Host>
        <div class="header">
          <slot></slot>
        </div>

        <div class="error">
          <slot name="error"></slot>
        </div>

        <form>
          <label htmlFor="email">{this.labelEmailAddress}:</label>
          <input type="text" name="email" value={this.email} onInput={(event) => this.handleEmailChange(event)}></input>
          <planit-error inline class={{
            'display': !!this.emailErrorMessage
          }}>{this.emailErrorMessage}</planit-error>

          <label htmlFor="pwd">{this.labelPassword}:</label>
          <input type="password" name="pwd" onInput={(event) => this.handlePwdChange(event)}></input>
          <planit-error inline class={{
            'display': !!this.pwdErrorMessage
          }}>{this.pwdErrorMessage}</planit-error>
        </form>

        <planit-button type="submit" onClick={(event: Event) => this.handleSubmit(event)}>Login</planit-button>
        <div class="signup">
          <slot name="signup"></slot>
        </div>
      </Host>
    );
  }

}
