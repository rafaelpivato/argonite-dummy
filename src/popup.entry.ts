import { PageEntry } from 'argonite-core';
import { CounterService } from './counter.service';

export class PopupEntry extends PageEntry {
  async mount(container: HTMLElement) {
    const button = document.createElement('button');
    button.textContent = 'Increment';

    button.onclick = async () => {
      const value = await this.runtime.request<number>({
        type: 'counter:increment',
      });

      button.textContent = `Count: ${value}`;
    };

    container.appendChild(button);
  }
}
