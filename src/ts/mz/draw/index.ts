import { Types } from '../types';

export { init2d } from './draw_2d';
export { initGl } from './draw_gl';

export type Drawer = (that :Types.DrawingRoot) => void;
