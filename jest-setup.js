global.render = (html, namespace) => {
  document.body.innerHTML = html;

  const wrapper = document.body.querySelector(namespace);

  return { wrapper, shadow: wrapper.shadowRoot };
};

global.getSlotContent = (element) => element.firstElementChild.assignedNodes();

global.simulate = (target, event, args) => {
  let EventType = null;

  switch (event) {
    case 'keydown':
      EventType = KeyboardEvent;
      break;

    case 'click':
      EventType = MouseEvent;
      break;

    default:
      EventType = Event;
  }

  target.dispatchEvent(new EventType(event, args));
};
