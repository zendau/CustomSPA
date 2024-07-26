export default function debounce(func: any, delay: any) {
  let timerId: any;

  return function (...args: any) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
