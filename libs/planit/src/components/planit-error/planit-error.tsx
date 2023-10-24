import { Component, ComponentInterface, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'planit-error',
  styleUrl: 'planit-error.css',
  shadow: true,
})
export class PlanitError implements ComponentInterface {
  @Prop() inline: boolean = false;

  render() {
    return (
      <Host role="alert"
        class={{
          'local': this.inline,
          'global': !this.inline
        }}>
        <div>
          <slot></slot>
        </div>
      </Host>
    );
  }

}
