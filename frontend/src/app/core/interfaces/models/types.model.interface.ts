import { SafeHtml } from '@angular/platform-browser';

export interface ModalConfig {
  message?: string;
  iconConfig?: {
    path?: SafeHtml;
    class?: string;
    backgroundClass?: string;
    ariaHidden?: string;
    fill?: string;
    viewBox?: string;
    xmlns?: string;
  };
  textClass?: string;
  buttonClass?: string;
  confirmButtonText?: string;
  state: 'created' | 'updated' | 'deleted' | 'error';
  srOnlyText?: string;
}
