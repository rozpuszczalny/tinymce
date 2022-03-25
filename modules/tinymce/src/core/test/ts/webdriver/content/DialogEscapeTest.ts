import { RealKeys, UiFinder } from '@ephox/agar';
import { describe, it } from '@ephox/bedrock-client';
import { SugarElement } from '@ephox/sugar';
import { TinyHooks } from '@ephox/wrap-mcagar';
import { assert } from 'chai';

import Editor from 'tinymce/core/api/Editor';

describe('webdriver.tinymce.core.content.DialogEscapeTest', () => {
  const hook = TinyHooks.bddSetupLight<Editor>({
    schema: 'html5',
    plugins: 'code',
    base_url: '/project/tinymce/js/tinymce'
  }, []);

  const pressEscape = async () =>
    await RealKeys.pSendKeysOn('.tox-dialog textarea', [ RealKeys.text('\uE00C') ]);

  it('Check dialog component can be focused', async () => {
    const editor = hook.editor();
    const events = [];
    const closeListener = () => {
      events.push('close');
    };
    const keyUpListener = (e) => {
      events.push('keyup-' + e.keyCode);
    };
    const keyDownListener = (e) => {
      events.push('keydown-' + e.keyCode);
    };

    editor.on('CloseWindow', closeListener);
    editor.on('keyup', keyUpListener);
    editor.on('keydown', keyDownListener);

    editor.execCommand('mceCodeEditor');
    UiFinder.pWaitFor('Wait for code window', SugarElement.fromDom(editor.getBody()), '.tox-dialog textarea')

    await pressEscape();

    editor.off('CloseWindow', closeListener);
    editor.off('keyup', keyUpListener);
    editor.off('keydown', keyDownListener);

    assert.deepEqual(events, [ 'close' ]);
  });
});
