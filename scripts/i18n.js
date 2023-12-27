import en from '../i18n/en.json' assert { type: 'json' };
import es from '../i18n/es.json' assert { type: 'json' };

const testTranslateTemplate = /\{\{([a-zA-Z0-9_.]*)\}\}/; 

const languages = {
  en,
  es,
}

export const translate = (lang = 'es') => {
  const dom = document.querySelectorAll('body *');
  const treeWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_ALL,
    null,
    false
  );

  // translate text nodes
  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode;

    if (node.nodeType === Node.TEXT_NODE) {
      const matched = node.nodeValue.match(testTranslateTemplate);
      if(matched) {
        const value = buildTranslateString(matched, languages[lang]);
        
        node.nodeValue = node.nodeValue.replace(matched[0], value);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      node.getAttributeNames()
      .forEach(atr => {
        const matched = node.getAttribute(atr).match(testTranslateTemplate);
        if(matched) {
          const value = buildTranslateString(matched, languages[lang]);
          
          node.setAttribute(atr, value);
        }
      });
    }
  }
}

function buildTranslateString(matched, lang) {
  const jsonString = matched[1];
  const parts = jsonString.split('.');
  
  return parts.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, lang);
}