import { Keys, RealKeys } from '@ephox/agar';
import { describe, it } from '@ephox/bedrock-client';
import { TinyHooks } from '@ephox/wrap-mcagar';
import { assert } from 'chai';

import Editor from 'tinymce/core/api/Editor';
// eslint-disable-next-line mocha/no-exclusive-tests
describe('alloy.browser.ui.dialog.DialogEscapeTest', () => {
  const hook = TinyHooks.bddSetupLight<Editor>({
    schema: 'html5',
    plugins: 'code',
    base_url: '/project/tinymce/js/tinymce'
  }, []);

  const pressEscape = async () => {
    await RealKeys.pSendKeysOn('.tox-dialog textarea', [ RealKeys.text('\uE00C') ]);
  };

  it('Check dialog component can be focused', async () => {
    const editor = hook.editor();
    let closedWindow = 0;
    let escapeKeyUp = 0;
    let escapeKeyDown = 0;

    const closeListener = () => {
      closedWindow++;
    };
    const keyUpListener = (e) => {
      if (e.keyCode === Keys.escape()) {
        escapeKeyUp++;
      }
    };
    const keyDownListener = (e) => {
      if (e.keyCode === Keys.escape()) {
        escapeKeyDown++;
      }
    };

    editor.on('CloseWindow', closeListener);
    editor.on('keyup', keyUpListener);
    editor.on('keydown', keyDownListener);

    editor.execCommand('mceCodeEditor');

    await pressEscape();

    editor.off('CloseWindow', closeListener);
    editor.off('keyup', keyUpListener);
    editor.off('keydown', keyDownListener);

    assert.equal(escapeKeyUp, 0, 'Escape up');
    assert.equal(escapeKeyDown, 0, 'Escape down');
    assert.equal(closedWindow, 1, 'closed window');
  });
});
