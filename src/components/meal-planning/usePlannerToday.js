import { zonedToday } from './plannerFormat';
import usePlannerNow from './usePlannerNow';

export default function usePlannerToday(zone) {
  return zonedToday(zone, new Date(usePlannerNow()));
}
