export interface ModalConfig {
  title: string;
  message: string;
  iconPath: string;
  iconClass: string;
  iconBackgroundClass: string;
  textClass: string;
  buttonClass: string;
  confirmButtonText: string;
  state: 'created' | 'updated' | 'deleted' | 'error';
}
