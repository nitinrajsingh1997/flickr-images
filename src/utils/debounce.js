function debounce(func, wait) {
  let timeout;

  return function (...args) {
    const context = this;
    console.log("de");
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}

export default debounce;
