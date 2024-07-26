export default function debounce(func: any, delay: any) {
  let timerId: any;

  if (!func) return

  return function (...args: any) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
