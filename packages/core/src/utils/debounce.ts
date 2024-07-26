export default function debounce(func: any, delay: any) {
  let timerId: any;

  let prevReactive: any = null

  return function (...args: any) {

    console.log('CALL DEBAUNCE')

    if (args[0] === prevReactive) {
      debugger
      console.log("REACTIVE COPY")
    } else {
      prevReactive = args[0]
    }

    console.log('args', args)
    func(...args)
    // clearTimeout(timerId);
    // timerId = setTimeout(() => {
    //   func(...args);
    // }, delay);
  };
}
