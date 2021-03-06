import Element from './element';

export function factory (options) {
  return new CardYearElement({ ...options, elements: this });
}

export class CardYearElement extends Element {
  static type = 'year';
  static elementClassName = 'CardYearElement';
}
