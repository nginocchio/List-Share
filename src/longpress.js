export const longpress = (node, duration) => {  
    let timer; 
    // const isTouchable = 'ontouchstart' in window;
    const isTouchable = window.matchMedia("(pointer: coarse)").matches;
    const eventStart = isTouchable ? 'touchstart' : 'mousedown';
    const eventEnd = isTouchable ? 'touchend' : 'mouseup';

    const handleMousedown = (e) => {
      timer = setTimeout(() => {  
        node.dispatchEvent(new CustomEvent("longpress"));  
      }, duration);  
    }; 
  
    const handleMouseup = () => {  
      clearTimeout(timer);  
    }; 

    const handleTouchMove = () => {
      clearTimeout(timer);  
    };
  
    node.addEventListener(eventStart, handleMousedown);  
    if (isTouchable) node.addEventListener('touchmove', handleTouchMove);
    node.addEventListener(eventEnd, handleMouseup); return {  
      destroy() {  
        node.removeEventListener(eventStart, handleMousedown);  
        node.removeEventListener(eventEnd, handleMouseup);  
        if (isTouchable) node.removeEventListener('touchmove', handleTouchMove);
      },  
      update(newDuration) {
        duration = newDuration;  
      }  
    };  
  };