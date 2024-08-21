

class Tooltip {
  element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  hide() {
    this.element.style.visibility = 'hidden';
    this.element.style.opacity = '0';
  }

  show() {
    this.element.style.visibility = 'visible';
    this.element.style.opacity = '1';
  }

  validateInput(input: HTMLInputElement, validityParams: { pattern?: string; min?: number; max?: number; minLength?: number }) {
    const value = input.value;
    let isValid = true;

    if (!value || (validityParams.minLength && value.length < validityParams.minLength)) {
      isValid = false;
    } else {
      if (validityParams.pattern) {
        const regex = new RegExp(validityParams.pattern);
        if (!regex.test(value)) {
          isValid = false;
        } 
      }
      if (validityParams.min !== undefined && parseFloat(value) < validityParams.min) {
        isValid = false;
      } 
      if (validityParams.max !== undefined && parseFloat(value) > validityParams.max) {
        isValid = false;
      }
    }

    if (!isValid) {
      this.show();
      input.setCustomValidity('Invalid field.');
    } else {
      this.hide();
      input.setCustomValidity('');
    }

    return isValid;
  }
}

export default Tooltip;