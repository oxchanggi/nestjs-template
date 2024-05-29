import { MessageMenu, PhotoMenu } from '../types/menu';

export type PageResponse = {
  text: string;
  menu: MessageMenu;
};

export type PhotoResponse = {
  photo: any;
  menu: PhotoMenu;
};

export enum EAmountLevel {
  Level1 = 1,
  Level2 = 2,
  Level3 = 3,
  Level5 = 5,
  Level4 = 10,
}

export enum EAmountShortLevel {
  Level1 = 1,
  Level5 = 5,
}

export enum ESlippageLevel {
  Level1 = 1,
  Level2 = 3,
  Level3 = 10,
}

export enum ELimitPercentLevel {
  Level1 = 10,
  Level2 = 20,
  Level3 = 30,
}
export enum EAmountPercentLevel {
  Level1 = 0.1,
  Level2 = 0.15,
  Level3 = 0.25,
  Level4 = 0.5,
  Level5 = 0.75,
  Level6 = 1,
}
