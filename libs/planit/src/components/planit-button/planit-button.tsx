import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'planit-button',
  styleUrl: 'planit-button.css',
  shadow: true,
})
export class PlanitButton {
  /**
   * The first name
   */
  @Prop() first: string;

  /**
   * The middle name
   */
  @Prop() middle: string;

  /**
   * The last name
   */
  @Prop() last: string;

  private getText(): string {
    return (
      (this.first || '') +
      (this.middle ? ` ${this.middle}` : '') +
      (this.last ? ` ${this.last}` : '')
    );
  }

  render() {
    return <div class="bg-indigo-500 p-6 rounded-md flex justify-center">Hello, World! I'm {this.getText()}!!!!!</div>;
  }
}
