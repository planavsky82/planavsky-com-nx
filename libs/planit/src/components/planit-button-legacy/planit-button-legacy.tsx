import { Component, ComponentInterface, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'planit-button-legacy',
  styleUrl: 'planit-button-legacy.css',
  shadow: true,
})
export class PlanitButtonLegacy implements ComponentInterface {
  @Prop({ reflect: true }) type: 'button' | 'submit' | 'reset' = 'button';

  render() {
    return (
      <Host>
        <button type={this.type}>
          <slot></slot>
        </button>
      </Host>
    );
  }

}
