import { Component, ComponentInterface, Host, h, Prop, getAssetPath } from '@stencil/core';
import { iOS, isIPad } from '../../utils/client';

// thanks to https://www.netguru.com/codestories/pwa-on-ios

@Component({
  tag: 'planit-pwa-indicator',
  styleUrl: 'planit-pwa-indicator.css',
  shadow: true,
  assetsDirs: ['assets']
})
export class PlanitPwaIndicator implements ComponentInterface {
  @Prop() display: boolean = iOS();
  @Prop() image = "Navigation_Action_2x.png";

  private isIPad: boolean = isIPad();
  private deviceName: 'iPhone' | 'iPad' = 'iPhone';
  constructor() {
    this.deviceName = this.isIPad ? 'iPad' : 'iPhone';
  }

  handleClick(/* event: UIEvent */) {
    this.display = false;
  }

  render() {
    return (
      <Host class={{
        'display': this.display,
        'ipad': this.isIPad
      }}>
        <div class="container">
          <div class="message">
            Install this webapp on your {this.deviceName}: tap
            <img class="action-icon" src={getAssetPath(`./assets/${this.image}`)} />
            and then <i>Add to Homescreen</i>
          </div>

          <div class="close" onClick={this.handleClick.bind(this)}>&times;</div>
        </div>
        <div class={{
          'pointer': true,
          'iphone': !this.isIPad
        }}></div>
        <slot></slot>
      </Host>
    );
  }

}
