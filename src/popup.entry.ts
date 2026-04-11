import { PageEntry } from 'argonite-core';

type CounterUpdatedMessage = {
  value: number;
};

export class PopupEntry extends PageEntry {
  async mount(container: HTMLElement) {
    const button = document.createElement('button');

    const initialCount = await this.runtime.request<number>({
      type: 'counter:get',
    });
    button.textContent = `Count: ${initialCount}`;

    this.runtime.onBroadcast<CounterUpdatedMessage>('counter:updated', (event) => {
      button.textContent = `Count: ${event.value}`;
    });

    button.onclick = async () => {
      const value = await this.runtime.request<number>({
        type: 'counter:increment',
      });

      button.textContent = `Count: ${value}`;
    };

    container.appendChild(button);
  }
}
