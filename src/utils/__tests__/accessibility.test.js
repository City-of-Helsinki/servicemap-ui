import { focusToViewTitle, viewTitleID } from '../accessibility';

describe('focusToViewTitle', () => {
  it('focuses the view title when present', () => {
    const title = document.createElement('button');
    title.id = viewTitleID;
    document.body.appendChild(title);
    const focus = vi.spyOn(title, 'focus');

    focusToViewTitle();

    expect(focus).toHaveBeenCalled();
    title.remove();
  });

  it('does nothing when the title is absent', () => {
    expect(() => focusToViewTitle()).not.toThrow();
  });
});
