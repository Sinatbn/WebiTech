const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

test('AI Multi-Hub Desktop Application Verification', async (t) => {
  const packageJsonPath = path.join(__dirname, '../package.json');
  const mainJsPath = path.join(__dirname, '../src/main.js');
  const indexHtmlPath = path.join(__dirname, '../src/index.html');
  const stylesCssPath = path.join(__dirname, '../src/styles.css');
  const rendererJsPath = path.join(__dirname, '../src/renderer.js');

  await t.test('package.json should have correct main, electron scripts and electron-builder NSIS/portable win config', () => {
    assert.strictEqual(fs.existsSync(packageJsonPath), true);
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    assert.strictEqual(pkg.main, 'src/main.js');
    assert.ok(pkg.scripts['start:electron']);
    assert.ok(pkg.scripts['dist']);

    assert.ok(pkg.build);
    assert.strictEqual(pkg.build.appId, 'com.aimultihub.desktop');
    assert.ok(pkg.build.win);

    const targets = pkg.build.win.target;
    const targetNames = targets.map((t) => (typeof t === 'string' ? t : t.target));
    assert.ok(targetNames.includes('nsis'));
    assert.ok(targetNames.includes('portable'));
  });

  await t.test('src/main.js should configure User-Agent spoofing and webviewTag', () => {
    assert.strictEqual(fs.existsSync(mainJsPath), true);
    const mainJs = fs.readFileSync(mainJsPath, 'utf8');

    assert.ok(mainJs.includes('webviewTag: true'));
    assert.ok(mainJs.includes('onBeforeSendHeaders'));
    assert.ok(mainJs.includes('Mozilla/5.0'));
    assert.ok(mainJs.includes('Chrome'));
  });

  await t.test('src/index.html should embed ChatGPT, Gemini, and DeepSeek webviews with correct sessions', () => {
    assert.strictEqual(fs.existsSync(indexHtmlPath), true);
    const html = fs.readFileSync(indexHtmlPath, 'utf8');

    assert.ok(html.includes('persist:chatgpt_session'));
    assert.ok(html.includes('persist:gemini_session'));
    assert.ok(html.includes('persist:deepseek_session'));

    assert.ok(html.includes('https://chatgpt.com/'));
    assert.ok(html.includes('https://gemini.google.com/'));
    assert.ok(html.includes('https://chat.deepseek.com/'));

    assert.ok(html.includes('btn-split-toggle'));
    assert.ok(html.includes('btn-global-back'));
    assert.ok(html.includes('btn-global-forward'));
    assert.ok(html.includes('btn-global-reload'));
  });

  await t.test('src/styles.css should include dark theme colors and 3-column split view layout', () => {
    assert.strictEqual(fs.existsSync(stylesCssPath), true);
    const css = fs.readFileSync(stylesCssPath, 'utf8');

    assert.ok(css.includes('#0b0f19'));
    assert.ok(css.includes('#111827'));
    assert.ok(css.includes('grid-template-columns: repeat(3, 1fr)'));
  });

  await t.test('src/renderer.js should handle tab switching, split-view mode, and navigation buttons', () => {
    assert.strictEqual(fs.existsSync(rendererJsPath), true);
    const rendererJs = fs.readFileSync(rendererJsPath, 'utf8');

    assert.ok(rendererJs.includes('btn-split-toggle'));
    assert.ok(rendererJs.includes('view-single'));
    assert.ok(rendererJs.includes('view-split'));
    assert.ok(rendererJs.includes('btn-global-reload'));
    assert.ok(rendererJs.includes('btn-pane-reload'));
  });
});
