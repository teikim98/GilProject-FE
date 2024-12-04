export interface emailFormProperty {
  name: string;
  nickName: string;
  email: string;
  password: string;
}

export interface Notice {
  title: string;
  content: string;
  writeDate: string;
}

export interface PopupData {
  title?: string;
  description?: string;
  content?: string;
  onConfirm?: () => void;
}

export interface ChangePopupData {
  isPopupOpen: boolean;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initialData: string;
  callback: (data: string) => void;
}
