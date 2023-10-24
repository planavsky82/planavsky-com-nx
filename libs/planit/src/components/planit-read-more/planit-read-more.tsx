import { Component, ComponentInterface, Host, h, State } from '@stencil/core';

@Component({
  tag: 'planit-read-more',
  styleUrl: 'planit-read-more.css',
  shadow: true,
})
export class PlanitReadMore implements ComponentInterface {
  @State() action: 'Read More' | 'Close' = 'Read More';
  @State() open: boolean = false;

  private toggle(): void {
    this.open = !this.open;
    if (this.open) {
      this.action = 'Close';
    } else {
      this.action = 'Read More';
    }
  }

  render() {
    return (
      <Host>
        <div class={{
          'open': this.open,
          'closed': !this.open
        }}>
          <slot></slot>
        </div>
        <a class="action" onClick={() => this.toggle()}>{this.action}</a>
      </Host>
    );
  }

}
