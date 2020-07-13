let xDown: number = 0;
let yDown: number = 0;

const swipeLeft: any = document.createEvent('swipe-left');

const getTouches = (evt: React.TouchEvent<HTMLElement>) => {
    return evt.touches; // browser API
}

const handleTouchStart = (evt: React.TouchEvent<HTMLElement>) => {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};

const handleTouchMove = (evt: React.TouchEvent<HTMLElement>) => {

    if (!xDown || !yDown) {
        return;
    }

    const xUp = evt.touches[0].clientX;
    const yUp = evt.touches[0].clientY;

    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
        if (xDiff > 0) {
            /* left swipe */
        } else {
            /* right swipe */
        }
    } else {
        if (yDiff > 0) {
            /* up swipe */
        } else {
            /* down swipe */
        }
    }
    /* reset values */
    xDown = 0;
    yDown = 0;
};

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);
