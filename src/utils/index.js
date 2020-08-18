export function throttle(f, wait) {
  var timer, args, context;
  return function() {
    context = this;
    args = arguments;
    if (timer) {
      return;
    }
    timer = setTimeout(function() {
      f.call(context, args);
      timer = null;
    }, wait);
  };
}

export function dobounce(f, wait) {
  var timer, args, context;
  return function() {
    context = this;
    args = arguments;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(function() {
      f.call(context, args);
      timer = null;
    }, wait);
  };
}
