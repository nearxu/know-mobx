import {dependManager} from './dependManager';

export const autorun = function(handler) {
    dependManager.beginCollect(handler);
    handler();
    dependManager.endCollect();
}