const showTaskInfo = (methodName) => console.log(`${methodName}: I'm task`);

const showMicroTaskInfo = (methodName) => console.log(`${methodName}: I'm microtask`);

const init = () => {
  document.body.addEventListener(`DOMContentLoaded`, () => showTaskInfo(`addEventListener`));

  setTimeout(() => showTaskInfo(`setTimeout`), 0);

  const interval = setInterval(() => {
    showTaskInfo(`setInterval`);
    clearInterval(interval);
  }, 0);

  Promise.resolve()
  .then(() => showMicroTaskInfo(`Promise.resolve()`));

  queueMicrotask(() => showMicroTaskInfo(`queueMicrotask`));

  const xhr = new XMLHttpRequest();
  xhr.open(`GET`, `https://echo.htmlacademy.ru`);
  xhr.send();
  xhr.onload = () => showTaskInfo(`XMLHttpRequest`);

  fetch(`https://echo.htmlacademy.ru`)
  .then(() => showMicroTaskInfo(`fetch`));

  window.postMessage(`postMessage`, window);
  window.onmessage = () => showTaskInfo(`postMessage`);

  const frame = requestAnimationFrame(() => {
    showTaskInfo(`requestAnimationFrame`);
    cancelAnimationFrame(frame);
  });

  const request = window.requestIdleCallback(() => {
    showTaskInfo(`requestIdleCallback`);
    window.cancelIdleCallback(request);
  });

  const observer = new MutationObserver(() => showMicroTaskInfo(`MutationObserver`));
  observer.observe(document.body, {
    childList: true,
  });
};

export {init};
