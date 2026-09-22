/** Photographic covers index. */
import { photoCare } from './photo_care';
import { photoCatering } from './photo_catering';
import { photoCleaning } from './photo_cleaning';
import { photoConstruction } from './photo_construction';
import { photoGardening } from './photo_gardening';
import { photoHome } from './photo_home';
import { photoHostess } from './photo_hostess';
import { photoMoving } from './photo_moving';
import { photoPainting } from './photo_painting';
import { photoWarehouse } from './photo_warehouse';

export { photoCare };
export { photoCatering };
export { photoCleaning };
export { photoConstruction };
export { photoGardening };
export { photoHome };
export { photoHostess };
export { photoMoving };
export { photoPainting };
export { photoWarehouse };

export const PHOTO_BY_KEY: Record<string, string> = {
  'care': photoCare,
  'catering': photoCatering,
  'cleaning': photoCleaning,
  'construction': photoConstruction,
  'gardening': photoGardening,
  'home': photoHome,
  'hostess': photoHostess,
  'moving': photoMoving,
  'painting': photoPainting,
  'warehouse': photoWarehouse,
};
