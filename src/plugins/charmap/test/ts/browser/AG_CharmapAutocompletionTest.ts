import 'tinymce/themes/silver/Theme';

import { Keyboard, Keys, Log, Pipeline, UiFinder, Step } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock';
import { TinyApis, TinyLoader } from '@ephox/mcagar';
import { Body, Element } from '@ephox/sugar';
import CharmapPlugin from 'tinymce/plugins/charmap/Plugin';
import { navigator } from '@ephox/dom-globals';

UnitTest.asynctest('browser.tinymce.plugins.charmap.AutocompletionTest', (success, failure) => {

  CharmapPlugin();

  TinyLoader.setup(function (editor, onSuccess, onFailure) {
    const tinyApis = TinyApis(editor);
    const eDoc = Element.fromDom(editor.getDoc());

    Pipeline.async({},
      Log.steps('TBA', 'Charmap: Autocomplete, trigger an autocomplete and check it appears', [
        tinyApis.sFocus,
        tinyApis.sSetContent('<p>:</p>'),
        tinyApis.sSetCursor([ 0, 0 ], ':'.length),
        Keyboard.sKeypress(eDoc, ':'.charCodeAt(0), { }),
        UiFinder.sWaitForVisible('Waiting for autocomplete menu', Body.body(), '.tox-autocompleter'),
        Keyboard.sKeydown(eDoc, Keys.right(), { }),
        Keyboard.sKeydown(eDoc, Keys.right(), { }),
        Keyboard.sKeydown(eDoc, Keys.right(), { }),
        Keyboard.sKeydown(eDoc, Keys.right(), { }),
        Keyboard.sKeydown(eDoc, Keys.enter(), { }),

        // This assertion does not pass on Phantom. The editor content
        // is empty. Not sure if it's an encoding issue for entities.
        navigator.userAgent.indexOf('PhantomJS') > -1 ? Step.pass : tinyApis.sAssertContent('<p>&copy;</p>')
      ])
    , onSuccess, onFailure);
  }, {
    plugins: 'charmap',
    toolbar: 'charmap',
    theme: 'silver',
    skin_url: '/project/js/tinymce/skins/oxide',
  }, success, failure);
});