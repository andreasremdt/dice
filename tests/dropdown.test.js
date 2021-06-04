require('../src/dropdown/dropdown.js');

describe('Rendering', () => {
  test('it renders a button with any content', () => {
    const { shadow } = render(
      `<dice-dropdown>
        User menu
        <span>icon</span>
      </dice-dropdown>`,
      'dice-dropdown',
    );

    const button = shadow.firstElementChild;
    const [content, icon] = getSlotContent(button);

    expect(button.tagName).toEqual('BUTTON');
    expect(button.getAttribute('part')).toEqual('button');

    expect(content.textContent.trim()).toEqual('User menu');
    expect(icon.textContent).toEqual('icon');
  });

  test('the menu contains the correct items', () => {
    const { shadow } = render(
      `<dice-dropdown>
        User menu
  
        <ul slot="menu" id="menu">
          <li><button>Settings</button></li>
          <li><button>Organizations</button></li>
        </ul>
      </dice-dropdown>`,
      'dice-dropdown',
    );

    const [menu] = getSlotContent(shadow.lastElementChild);

    expect(menu.tagName).toEqual('UL');
    expect(menu.getAttribute('id')).toEqual('menu');
    expect(menu.children.length).toEqual(2);
  });
});

describe('Mouse navigation', () => {
  test('when clicking the button, the menu opens and closes', () => {
    const { shadow } = render(
      `<dice-dropdown>
        User menu
        
        <ul slot="menu">
          <li><button>Settings</button></li>
          <li><button>Organizations</button></li>
        </ul>
      </dice-dropdown>`,
      'dice-dropdown',
    );

    const button = shadow.firstElementChild;
    const menu = shadow.lastElementChild;

    expect(menu.hasAttribute('hidden')).toEqual(true);
    expect(button.getAttribute('aria-expanded')).toEqual('false');

    simulate(button, 'click');

    expect(menu.hasAttribute('hidden')).toEqual(false);
    expect(button.getAttribute('aria-expanded')).toEqual('true');

    simulate(button, 'click');

    expect(menu.hasAttribute('hidden')).toEqual(true);
    expect(button.getAttribute('aria-expanded')).toEqual('false');
  });

  test('when clicking outside the dropdown, it is closed', () => {
    const { shadow } = render(
      `<dice-dropdown open>
        User menu

        <ul slot="menu">
          <li><button>Settings</button></li>
          <li><button>Organizations</button></li>
        </ul>
      </dice-dropdown>`,
      'dice-dropdown',
    );

    const menu = shadow.lastElementChild;

    document.body.click();

    expect(menu.hasAttribute('hidden')).toEqual(true);
  });
});

describe('Keyboard navigation', () => {
  test('when pressing Escape, the dropdown is closed', () => {
    const { wrapper, shadow } = render(
      `<dice-dropdown open>
        User menu
        
        <ul slot="menu">
          <li><button>Settings</button></li>
          <li><button>Organizations</button></li>
        </ul>
      </dice-dropdown>`,
      'dice-dropdown',
    );

    const button = shadow.firstElementChild;
    const menu = shadow.lastElementChild;

    simulate(document, 'keydown', { key: 'Escape' });

    expect(menu.hasAttribute('hidden')).toEqual(true);
    expect(button.getAttribute('aria-expanded')).toEqual('false');
    expect(document.activeElement).toEqual(wrapper);
  });

  test('when pressing Tab, the next menu item is focused', () => {
    const { shadow } = render(
      `<dice-dropdown>
        User menu
        
        <ul slot="menu">
          <li><button>Settings</button></li>
          <li><button>Organizations</button></li>
        </ul>
      </dice-dropdown>`,
      'dice-dropdown',
    );

    const button = shadow.firstElementChild;
    const menu = shadow.lastElementChild;
    const [items] = getSlotContent(menu);

    simulate(button, 'click');
    expect(document.activeElement).toEqual(document.body);
    simulate(document, 'keydown', { key: 'Tab' });
    expect(document.activeElement).toEqual(items.children[0].firstElementChild);
    simulate(document, 'keydown', { key: 'Tab' });
    expect(document.activeElement).toEqual(items.children[1].firstElementChild);
    simulate(document, 'keydown', { key: 'Tab' });
    expect(button.getAttribute('aria-expanded')).toEqual('false');
  });

  test('when pressing Shift + Tab, the previous menu item is focused', () => {
    const { shadow } = render(
      `<dice-dropdown>
        User menu
        
        <ul slot="menu">
          <li><button>Settings</button></li>
          <li><button>Organizations</button></li>
        </ul>
      </dice-dropdown>`,
      'dice-dropdown',
    );

    const button = shadow.firstElementChild;
    const menu = shadow.lastElementChild;
    const [items] = getSlotContent(menu);

    simulate(button, 'click');
    expect(document.activeElement).toEqual(document.body);
    simulate(document, 'keydown', { key: 'End' });
    expect(document.activeElement).toEqual(items.children[1].firstElementChild);
    simulate(document, 'keydown', { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toEqual(items.children[0].firstElementChild);
  });

  test('the next/previous menu item can be focused with arrow keys', () => {
    const { shadow } = render(
      `<dice-dropdown>
        User menu
        
        <ul slot="menu">
          <li><button>Settings</button></li>
          <li><button>Organizations</button></li>
        </ul>
      </dice-dropdown>`,
      'dice-dropdown',
    );

    const button = shadow.firstElementChild;
    const menu = shadow.lastElementChild;
    const [items] = getSlotContent(menu);

    simulate(button, 'click');
    simulate(document, 'keydown', { key: 'ArrowDown' });
    expect(document.activeElement).toEqual(items.children[0].firstElementChild);
    simulate(document, 'keydown', { key: 'ArrowDown' });
    expect(document.activeElement).toEqual(items.children[1].firstElementChild);
    simulate(document, 'keydown', { key: 'ArrowDown' });
    expect(document.activeElement).toEqual(items.children[1].firstElementChild);
    simulate(document, 'keydown', { key: 'ArrowUp' });
    expect(document.activeElement).toEqual(items.children[0].firstElementChild);
    simulate(document, 'keydown', { key: 'ArrowUp' });
    expect(document.activeElement).toEqual(items.children[0].firstElementChild);
  });

  test('the first/last menu item can be focused directly', () => {
    const { shadow } = render(
      `<dice-dropdown>
        User menu
        
        <ul slot="menu">
          <li><button>Settings</button></li>
          <li><button>Profile</button></li>
          <li><button>Organizations</button></li>
        </ul>
      </dice-dropdown>`,
      'dice-dropdown',
    );

    const button = shadow.firstElementChild;
    const menu = shadow.lastElementChild;
    const [items] = getSlotContent(menu);

    simulate(button, 'click');
    simulate(document, 'keydown', { key: 'End' });
    expect(document.activeElement).toEqual(items.children[2].firstElementChild);
    simulate(document, 'keydown', { key: 'Home' });
    expect(document.activeElement).toEqual(items.children[0].firstElementChild);
  });
});

describe('Public API', () => {
  test('the open state can be controlled via `open`', () => {
    const { wrapper, shadow } = render(
      `<dice-dropdown>
        User menu
      </dice-dropdown>`,
      'dice-dropdown',
    );

    const menu = shadow.lastElementChild;

    wrapper.setAttribute('open', 'true');
    expect(menu.hasAttribute('hidden')).toEqual(false);
    wrapper.removeAttribute('open');
    expect(menu.hasAttribute('hidden')).toEqual(true);

    wrapper.open = true;
    expect(menu.hasAttribute('hidden')).toEqual(false);
    wrapper.open = false;
    expect(menu.hasAttribute('hidden')).toEqual(true);
  });

  test.todo('the vertical alignment can be controlled via `align`');

  test.todo('the horizontal alignment can be controlled via `placement`');

  test('the open state can be controlled via `show` and `hide`', () => {
    const { wrapper, shadow } = render(
      `<dice-dropdown>
        User menu
      </dice-dropdown>`,
      'dice-dropdown',
    );

    const menu = shadow.lastElementChild;

    wrapper.show();
    expect(menu.hasAttribute('hidden')).toEqual(false);
    wrapper.hide();
    expect(menu.hasAttribute('hidden')).toEqual(true);
  });
});
