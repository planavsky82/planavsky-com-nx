import { Component, ComponentInterface, Host, h, Prop, Event, EventEmitter, State } from '@stencil/core';
import { Validator, ValidatorMessages } from '../../utils/validator';

export interface SignUpEvent {
  email: string;
  pwd1: string;
  pwd2: string;
}

@Component({
  tag: 'planit-signup',
  styleUrl: 'planit-signup.css',
  shadow: true,
})
export class PlanitSignup implements ComponentInterface {
  @Prop() labelEmailAddress: string = "Email Address";
  @Prop() labelPassword1: string = "Password";
  @Prop() labelPassword2: string = "Re-Enter Password";

  @Event() submitSignup: EventEmitter<SignUpEvent>;

  @State() email: string;
  @State() pwd1: string;
  @State() pwd2: string;

  private validator: Validator = new Validator();

  public emailErrorMessage: ValidatorMessages;
  public pwd1ErrorMessage: ValidatorMessages;
  public pwd2ErrorMessage: ValidatorMessages;

  constructor() {}

  handleSubmit(event: Event) {
    event.preventDefault();
    this.submitSignup.emit({
      email: this.email,
      pwd1: this.pwd1,
      pwd2: this.pwd2
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

  handlePwd1Change(event?: Event) {
    this.pwd1ErrorMessage = undefined;
    if (event) {
      const target = event.target as HTMLInputElement;
      this.pwd1 = target.value;
    }
    let value = this.validator.hasValue(this.pwd1);
    if (value.valid) {
      value = this.validator.isValidPassword(this.pwd1);
    }
    if (value.valid) {
      value = this.validator.valuesMatch(this.pwd1, this.pwd2, 'Password');
    }
    if (!value.valid) {
      this.pwd1ErrorMessage = value.message;
    }
    if (event) {
      this.handlePwd2Change();
    }
  }

  handlePwd2Change(event?: Event) {
    this.pwd2ErrorMessage = undefined;
    if (event) {
      const target = event.target as HTMLInputElement;
      this.pwd2 = target.value;
    }
    let value = this.validator.hasValue(this.pwd2);
    if (value.valid) {
      value = this.validator.isValidPassword(this.pwd2);
    }
    if (value.valid) {
      value = this.validator.valuesMatch(this.pwd1, this.pwd2, 'Password');
    }
    if (!value.valid) {
      this.pwd2ErrorMessage = value.message;
    }
    if (event) {
      this.handlePwd1Change();
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
          <input type="text" value="" name="email" onInput={(event) => this.handleEmailChange(event)}></input>
          <planit-error inline class={{
            'display': !!this.emailErrorMessage
          }}>{this.emailErrorMessage}</planit-error>
          <label htmlFor="pwd1">{this.labelPassword1}:</label>
          <input type="password" value="" name="pwd1" onInput={(event) => this.handlePwd1Change(event)}></input>
          <planit-error inline class={{
            'display': !!this.pwd1ErrorMessage
          }}>
            {this.pwd1ErrorMessage
              ? <div>
                {this.pwd1ErrorMessage.map((error: string) =>
                  <div>{error}</div>
                )}
                </div>
              : <span></span>
            }
          </planit-error>
          <label htmlFor="pwd2">{this.labelPassword2}:</label>
          <input type="password" value="" name="pwd2" onInput={(event) => this.handlePwd2Change(event)}></input>
          <planit-error inline class={{
            'display': !!this.pwd2ErrorMessage
          }}>
            {this.pwd2ErrorMessage
              ? <div>
                {this.pwd2ErrorMessage.map((error: string) =>
                  <div>{error}</div>
                )}
                </div>
              : <span></span>
            }
          </planit-error>
        </form>

        <planit-button type="submit" onClick={(event: Event) => this.handleSubmit(event)}>Sign Up</planit-button>
        <slot name="footer"></slot>
      </Host>
    );
  }
}
