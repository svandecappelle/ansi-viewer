/* eslint-env webextensions */
import {content_scripts as contentScripts} from "../extension/manifest.json";

const VALID_CONTENT_TYPE = new Set([
  "text/plain", "text/ansi", "text/x-ansi"
]);

const ansiViewer = createANSIViewer();

browser.webRequest.onHeadersReceived.addListener(details => {
  if (details.method == "POST") {
    return;
  }
  if (details.statusCode !== 200) {
    return;
  }
  const header = details.responseHeaders.find(h => h.name == "Content-Type");
  if (!header) {
    return;
  }
  const url = new URL(details.url);
  if (/\.(ans|bbs|ansi)$/.test(url.pathname) && VALID_CONTENT_TYPE.has(header.value)) {
    // FIXME: handle file requests
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1341341
    ansiViewer.schedule(details.tabId, details.url);
    return {responseHeaders: details.responseHeaders.filter(h => h !== header)};
  }
}, {
  urls: ["<all_urls>"],
  types: ["main_frame"]
}, ["blocking", "responseHeaders"]);

const ansiWorker = createANSIWorker();

const METHODS = {
  compileANSI: ansiWorker.compileANSI,
  viewAsANSI: () =>
    browser.tabs.executeScript(null, {code: "document.contentType"})
      .then(([type]) => {
        if (VALID_CONTENT_TYPE.has(type)) {
          return ansiViewer.inject();
        }
      })
      .catch(console.error)
};

browser.runtime.onMessage.addListener(message => {
  if (!METHODS[message.method]) {
    return;
  }
  return METHODS[message.method](message.data)
    .catch(err => {
      console.error(err); // eslint-disable-line
      throw err;
    });
});

browser.contextMenus.create({
  title: "View as ANSI",
  onclick(info, tab) {
    ansiViewer.inject(tab.id);
  }
});

browser.commands.onCommand.addListener(command => {
  if (!METHODS[command]) {
    return;
  }
  METHODS[command]();
});

function createANSIWorker() {
  let worker;
  let error;
  let nextId = 0;
  const waitForResponse = new Map;
  return {compileANSI};
  
  function init() {
    worker = new Worker("/js/ansi-worker.js");
    worker.addEventListener("error", onError);
    worker.addEventListener("message", onMessage);
  }
  
  function compileANSI(data) {
    if (!worker) {
      init();
    }
    return new Promise((resolve, reject) => {
      if (error) {
        reject(error);
        return;
      }
      const requestId = nextId++;
      worker.postMessage({requestId, data});
      waitForResponse.set(requestId, {resolve, reject});
    });
  }
  
  function onError(err) {
    error = err;
  }
  
  function onMessage(e) {
    if (e.data.error) {
      waitForResponse.get(e.data.requestId).reject(e.data.data);
    } else {
      waitForResponse.get(e.data.requestId).resolve(e.data.data);
    }
    waitForResponse.delete(e.data.requestId);
  }
}

function createANSIViewer() {
  const waitForUpdate = new Set;
  return {schedule, inject};
  
  function inject(tabId = null) {
    for (const file of contentScripts[0].js) {
      browser.tabs.executeScript(tabId, {file});
    }
    for (const file of contentScripts[0].css) {
      browser.tabs.insertCSS(tabId, {file});
    }
  }
  
  // inject when the URL of the tab had been changed to url
  function schedule(tabId, url) {
    if (waitForUpdate.has(tabId)) {
      return;
    }
    browser.tabs.onUpdated.addListener(onUpdated);
    browser.tabs.onRemoved.addListener(onRemoved);
    waitForUpdate.add(tabId);
    
    function uninit() {
      browser.tabs.onUpdated.removeListener(onUpdated);
      browser.tabs.onRemoved.removeListener(onRemoved);
      waitForUpdate.delete(tabId);
    }
    
    function onUpdated(_tabId, changeInfo, tab) {
      if (_tabId !== tabId || tab.url !== url) {
        return;
      }
      inject(tabId);
      uninit();
    }
    
    function onRemoved(_tabId) {
      if (_tabId === tabId) {
        uninit();
      }
    }
  }
}
