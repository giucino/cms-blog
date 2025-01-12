import { SafeHtml } from '@angular/platform-browser';

export interface ModalConfig {
  message: string;
  buttonText: string;
  iconConfig?: {
    path?: string | SafeHtml;
    class?: string;
    backgroundClass?: string;
    ariaHidden?: string;
    fill?: string;
    viewBox?: string;
    xmlns?: string;
  };
  messageClass?: string;
  buttonClass?: string;
  state: 'created' | 'updated' | 'deleted' | 'error';
  srOnlyText?: string;
}
